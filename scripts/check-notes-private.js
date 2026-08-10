// Fails if anything under notes/ is tracked: it holds ProductBoard notes and drafts,
// and this repo is public. Catches a forced add before it reaches a commit.
const { execSync } = require('child_process');

let tracked = '';
try {
  tracked = execSync('git ls-files notes/', {
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
    stdio: ['ignore', 'pipe', 'ignore'],
  }).toString().trim();
} catch {
  console.log('check-notes-private: no git here, skipped.');
  process.exit(0);
}

if (tracked) {
  console.error(
    'notes/ is tracked by git, and this repo is public:\n  ' +
    tracked.split('\n').join('\n  ') +
    '\nRun `git rm --cached -r notes/` — it holds ProductBoard notes and local drafts.'
  );
  process.exit(1);
}
console.log('check-notes-private: notes/ is untracked.');
