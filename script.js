const bar = document.getElementById('topbar');
const menu = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (bar) {
  const updateHeader = () => bar.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

if (menu && nav) {
  const closeMenu = () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
  };
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// Marca a página atual no menu.
const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('#nav a').forEach(a => {
  const href = (a.getAttribute('href') || '').split('#')[0];
  if ((current === 'index.html' && (href === '' || href === 'index.html')) || href === current) {
    a.setAttribute('aria-current', 'page');
  }
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }), { threshold: .08 });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('visible'));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const items = document.querySelectorAll('[data-lightbox]');
if (items.length) {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Imagem ampliada');
  box.innerHTML = '<button type="button" aria-label="Fechar imagem">×</button><img alt="Imagem ampliada">';
  document.body.appendChild(box);
  const image = box.querySelector('img');
  const close = () => { box.classList.remove('open'); image.removeAttribute('src'); };
  items.forEach(item => item.addEventListener('click', () => {
    image.src = item.dataset.lightbox;
    box.classList.add('open');
    box.querySelector('button').focus();
  }));
  box.addEventListener('click', e => { if (e.target === box || e.target.tagName === 'BUTTON') close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

async function carregarConfiguracoes(){
  try{
    const r=await fetch('content/settings.json',{cache:'no-store'});
    if(!r.ok) return;
    const c=await r.json();
    document.querySelectorAll('[data-setting]').forEach(el=>{const k=el.dataset.setting;if(c[k]!==undefined) el.textContent=c[k];});
    document.querySelectorAll('[data-setting-src]').forEach(el=>{const k=el.dataset.settingSrc;if(c[k]) el.src=c[k];});
    document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{
      const msg=new URL(a.href).searchParams.get('text')||c.mensagem_orcamento||'';
      a.href=`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(msg)}`;
    });
  }catch(e){console.warn('Não foi possível carregar as configurações do site.',e);}
}
carregarConfiguracoes();
