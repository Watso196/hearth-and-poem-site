(async function() {
  const res = await fetch('/search.json');
  const poems = await res.json();

  const fuse = new Fuse(poems, {
    keys: ['title', 'content'],
    includeScore: true,
    threshold: 0.3
  });

  const searchInput = document.getElementById('poemSearch');
  const poemList = document.getElementById('poemList');
  const searchStatus = document.getElementById('searchStatus');

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function renderPoems(items) {
  poemList.innerHTML = items.map(poem => {
    const lines = poem.excerptLines
      || (poem.excerpt ? poem.excerpt.split(/\r?\n/) : [])
      || [];

    return `
      <article class="poem-list-item">
        <h2><a href="${poem.url}">${escapeHtml(poem.title)}</a></h2>
        <p class="date">${escapeHtml(poem.date)}</p>
        ${lines.map(l => `<p class="poem-line">${escapeHtml(l)}</p>`).join('')}
        <ul class="tag-list">
          ${(poem.tags || []).map(tag => `<li>${escapeHtml(tag)}</li>`).join('')}
        </ul>
        <p class="read-more"><a href="${poem.url}">Read "${escapeHtml(poem.title)}"</a></p>
      </article>
    `;
  }).join('');
}


  // Initial render
  renderPoems(poems);

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (!query) {
      renderPoems(poems);
      return;
    }
    const results = fuse.search(query).map(r => r.item);

    renderPoems(results, query);

    const ariaLive = document.getElementById("searchStatus");
    ariaLive.nodeValue = `Found ${results.length} results for ${query}`;
  });
})();
