// Indexes ProductBoard notes into notes/demand/ so bets and issues can cite evidence
// an agent can find. One-way: ProductBoard stays the place notes are collected and read.
// Run --probe first against a new workspace; the note shape below is what v2 returns for ours.
const fs = require('fs');
const os = require('os');
const path = require('path');

const TOKEN = process.env.PRODUCTBOARD_TOKEN;
const OUT = path.join(__dirname, '..', 'notes', 'demand');
const SCRATCH = path.join(os.tmpdir(), 'booktower-demand');

const args = process.argv.slice(2);
const flag = name => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const probe = args.includes('--probe');
const bodies = args.includes('--bodies');
const since = flag('since');

if (!TOKEN) {
  console.error('PRODUCTBOARD_TOKEN is not set.\n' +
    'ProductBoard → Workspace settings → Integrations → Public API → Access token, then:\n' +
    '  export PRODUCTBOARD_TOKEN=pb_xxx');
  process.exit(1);
}

async function fetchNotes() {
  const first = new URL('https://api.productboard.com/v2/notes');
  if (since) first.searchParams.set('createdFrom', since);

  const all = [];
  let next = first.toString();
  while (next) {
    const res = await fetch(next, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${await res.text()}`);
    const body = await res.json();
    all.push(...(body.data ?? []));
    next = probe ? null : body.links?.next;
    process.stdout.write(`\rfetched ${all.length} notes`);
  }
  process.stdout.write('\n');
  return all;
}

const plain = (html = '') => html
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(p|div|li)>/gi, '\n')
  .replace(/<li[^>]*>/gi, '- ')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
  .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
  .replace(/[ \t]+\n/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const tagsOf = n => (n.tags ?? []).map(t => t.name ?? t).filter(Boolean);
const day = n => (n.createdAt ?? '').slice(0, 10);
const title = n => n.title?.trim() || '(untitled)';

function byMonth(notes) {
  const months = new Map();
  for (const n of notes) {
    const month = (n.createdAt ?? 'undated').slice(0, 7);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(n);
  }
  for (const group of months.values()) {
    group.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  }
  return [...months].sort().reverse();
}

// Titles, tags and links only — the note text stays in ProductBoard, so this file can sit
// in a working tree without becoming a second copy of helpdesk mail.
function writeIndex(notes) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, '.gitignore'), '*\n');

  const findings = path.join(OUT, 'FINDINGS.md');
  const cited = fs.existsSync(findings) ? fs.readFileSync(findings, 'utf8') : '';
  const isCited = n => cited.includes(n.id);

  const tally = new Map();
  for (const n of notes) for (const t of tagsOf(n)) tally.set(t, (tally.get(t) ?? 0) + 1);

  const line = n => '- ' + [
    isCited(n) ? '~~read~~' : '**to read**',
    `\`${n.id}\``,
    day(n),
    tagsOf(n).join(', '),
    n.displayUrl ? `[${title(n)}](${n.displayUrl})` : title(n),
  ].filter(Boolean).join(' · ');

  const text = [
    '# Demand index',
    '',
    `${notes.length} ProductBoard notes${since ? ` since ${since}` : ''}, indexed ${new Date().toISOString().slice(0, 10)}.`,
    `Cited in FINDINGS.md: ${notes.filter(isCited).length} of ${notes.length}. The rest are still to read.`,
    'Open a note in ProductBoard to read it, then write what it means into FINDINGS.md.',
    'Regenerate with `npm run sync:demand`; add `--bodies` for a temporary local copy of the text.',
    '',
    ...byMonth(notes).flatMap(([month, group]) => [`## ${month} — ${group.length}`, '', ...group.map(line), '']),
    '## Tags',
    '',
    ...(tally.size
      ? [...tally].sort((a, b) => b[1] - a[1]).map(([t, c]) => `- ${t} — ${c}`)
      : ['No tags on any note — untagged notes are mail, not demand.']),
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT, 'INDEX.md'), text);
  console.log(`notes/demand/INDEX.md — ${notes.length} notes`);
}

// Scratch, not storage: outside the repo and outside anything backed up with it.
function writeBodies(notes) {
  fs.rmSync(SCRATCH, { recursive: true, force: true });
  fs.mkdirSync(SCRATCH, { recursive: true });

  const block = n => {
    const meta = [
      ['id', n.id],
      ['created', day(n)],
      ['state', n.state],
      ['source', n.source?.origin ?? n.source?.system],
      ['tags', tagsOf(n).join(', ')],
      ['link', n.displayUrl],
    ].filter(([, v]) => v);
    const text = plain(n.content);
    return [`### ${title(n)}`, '', ...meta.map(([k, v]) => `- ${k}: ${v}`), '', ...(text ? [text, ''] : [])].join('\n');
  };

  for (const [month, group] of byMonth(notes)) {
    fs.writeFileSync(
      path.join(SCRATCH, `${month}.md`),
      `# Demand — ${month}\n\n${group.length} note${group.length === 1 ? '' : 's'}, newest first. Temporary copy; delete when done.\n\n${group.map(block).join('\n')}`,
    );
  }
  console.log(`${SCRATCH} — note text, delete when done`);
}

fetchNotes().then(notes => {
  if (probe) {
    console.log(JSON.stringify(notes[0] ?? null, null, 2));
    return;
  }
  if (!notes.length) {
    console.log('No notes returned — check the token scope or --since.');
    return;
  }
  writeIndex(notes);
  if (bodies) writeBodies(notes);
}).catch(err => {
  console.error(err.message);
  process.exit(1);
});
