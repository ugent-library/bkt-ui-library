module.exports = function renderOrgSuggest() {
  return `
<ul class="list-unstyled mb-0 py-1">
  <li>
    <a href="#" class="d-flex align-items-start gap-3 py-2 px-3 text-decoration-none text-body" role="option" hx-post="/settings/scope/org" hx-vals='{"org_id":"fw","org_name":"Faculty of Sciences"}' hx-target="#org-scope-list" hx-swap="outerHTML" hx-on:click="document.getElementById('org-suggest').hidden = true; document.getElementById('org-search').value = ''; document.getElementById('org-search').setAttribute('aria-expanded', 'false')">
      <i class="if if-building if--sm text-muted flex-shrink-0 mt-1" aria-hidden="true"></i>
      <div>
        <div class="fw-semibold">Faculty of Sciences</div>
        <div class="small text-muted">FW · 3,201 works</div>
      </div>
    </a>
  </li>
  <li>
    <a href="#" class="d-flex align-items-start gap-3 py-2 px-3 text-decoration-none text-body" role="option" hx-post="/settings/scope/org" hx-vals='{"org_id":"ing","org_name":"Faculty of Engineering"}' hx-target="#org-scope-list" hx-swap="outerHTML" hx-on:click="document.getElementById('org-suggest').hidden = true; document.getElementById('org-search').value = ''; document.getElementById('org-search').setAttribute('aria-expanded', 'false')">
      <i class="if if-building if--sm text-muted flex-shrink-0 mt-1" aria-hidden="true"></i>
      <div>
        <div class="fw-semibold">Faculty of Engineering</div>
        <div class="small text-muted">ING · 2,840 works</div>
      </div>
    </a>
  </li>
</ul>`;
};
