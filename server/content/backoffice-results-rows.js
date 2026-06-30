module.exports = function renderBackofficeResultsRows() {
  return `
<tr>
  <td><input type="checkbox" class="form-check-input row-check" aria-label="Select Urban forests record"></td>
  <td><a href="#" class="fw-semibold text-decoration-none">Urban forests as essential infrastructure for climate resilience and biodiversity</a></td>
  <td>Journal article</td>
  <td>2026</td>
  <td><span class="badge bg-success">Published</span></td>
</tr>
<tr>
  <td><input type="checkbox" class="form-check-input row-check" aria-label="Select tree canopy dataset"></td>
  <td><a href="#" class="fw-semibold text-decoration-none">Urban tree canopy cover measurements Belgium 2020–2025</a></td>
  <td>Dataset</td>
  <td>2026</td>
  <td><span class="badge bg-info">Submitted</span></td>
</tr>`;
};
