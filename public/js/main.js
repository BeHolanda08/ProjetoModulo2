document.getElementById('search_icon_responsive').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('search-container').classList.add('show');
  document.getElementById('lnk-close').addEventListener('click', () => {
    e.preventDefault();
    document.getElementById('search-container').classList.remove('show');
  });
});