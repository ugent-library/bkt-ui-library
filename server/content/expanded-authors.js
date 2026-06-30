module.exports = function renderExpandedAuthors() {
  return `
    <a href="#">Esperon‑Rodriguez, M.</a>,
    <a href="#">Arndt, S.</a>,
    <a href="#">De Pauw, K.</a>,
    <a href="#">Curie, S.</a>,
    <span>Van den Berg, A.</span>,
    <span>Vandeurzen, B.</span>,
    <span>Van de Walle, C.</span>,
    <span>Vanput, D.</span>,
    <span>Putzeys, E.</span>,
    <span>Pourry Montgomery, F.</span>
    <span id="authors-loading" class="htmx-indicator">Loading…</span>
    <button type="button" class="btn btn-ghost btn-xs">
      Show less
    </button>
  `;
};
