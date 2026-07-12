(() => {
  const get = (obj, path) => path.split('.').reduce((v, k) => v && v[k], obj);
  const apply = (data) => {
    document.querySelectorAll('[data-content]').forEach((el) => {
      const value = get(data, el.dataset.content);
      if (value !== undefined && value !== null) el.textContent = value;
    });
    document.querySelectorAll('[data-content-html]').forEach((el) => {
      const value = get(data, el.dataset.contentHtml);
      if (value !== undefined && value !== null) el.innerHTML = value;
    });
    document.querySelectorAll('[data-content-src]').forEach((el) => {
      const value = get(data, el.dataset.contentSrc);
      if (value) el.src = value;
    });
    const phone = get(data, 'store.phoneDigits');
    if (phone) {
      document.querySelectorAll('a[href*="wa.me/"]').forEach((a) => {
        a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${phone}`);
      });
    }
  };
  fetch('/content.json?ts=' + Date.now(), { cache: 'no-store' })
    .then((response) => response.ok ? response.json() : Promise.reject(response.status))
    .then(apply)
    .catch((error) => console.warn('Conteúdo padrão usado:', error));
})();
