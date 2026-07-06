module.exports = function renderExpandedAuthors() {
  return `
    <a href="#">Manuel Esperon‑Rodriguez</a>,
    <a href="#">Stefan Arndt</a>,
    <a href="#">Karen De Pauw</a>,
    <a href="#">Sofie Curie</a>,
    <span>Anna Van den Berg</span>,
    <span>Bart Vandeurzen</span>,
    <span>Charlotte Van de Walle</span>,
    <span>Dries Vanput</span>,
    <span>Els Putzeys</span>,
    <span>Fien Pourry Montgomery</span>
    <span id="authors-loading" class="htmx-indicator">Loading&hellip;</span>
    <button type="button" class="btn btn-ghost btn-xs">
      Show less
    </button>
  `;
};
