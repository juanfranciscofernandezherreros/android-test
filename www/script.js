// --- Búsqueda que filtra unidades y subtemas ---
const q = document.getElementById('q');
const containers = [document.getElementById('grammar'), document.getElementById('vocab')];
const empty = document.getElementById('empty');

function filterList(value) {
  const query = value.trim().toLowerCase();
  let anyVisible = false;

  containers.forEach(list => {
    list.querySelectorAll('> li').forEach(item => {
      const details = item.querySelector('details');
      const summaryText = details?.querySelector('summary')?.textContent.toLowerCase() || '';
      const subLis = item.querySelectorAll('.sublist li');
      let matchUnit = summaryText.includes(query);
      let matchAnySub = false;

      if (subLis.length) {
        subLis.forEach(li => {
          const m = li.textContent.toLowerCase().includes(query);
          li.classList.toggle('hidden', !m && query);
          if (m) matchAnySub = true;
        });
      }

      const show = !query || matchUnit || matchAnySub;
      item.classList.toggle('hidden', !show);
      if (show) anyVisible = true;

      if (details) {
        if (query && (matchAnySub || matchUnit)) details.open = true;
        else if (!query) details.open = false;
      }
    });
  });

  empty.style.display = anyVisible ? 'none' : 'block';
}

q.addEventListener('input', e => filterList(e.target.value));

// Expandir / contraer todo
document.getElementById('expand').addEventListener('click', () => {
  document.querySelectorAll('details').forEach(d => d.open = true);
});
document.getElementById('collapse').addEventListener('click', () => {
  document.querySelectorAll('details').forEach(d => d.open = false);
});
document.getElementById('clear').addEventListener('click', () => {
  q.value = '';
  filterList('');
});
