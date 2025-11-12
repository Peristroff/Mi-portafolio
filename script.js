// Preferencias de tema
const root = document.documentElement;
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem('theme'); // 'light' | 'dark' | null
if ((savedTheme === 'light') || (!savedTheme && prefersLight)) root.classList.add('light');

const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  const setLabel = () => themeBtn.textContent = root.classList.contains('light') ? 'Modo oscuro' : 'Modo claro';
  setLabel();
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    setLabel();
  });
}

// Menú móvil
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
if (hamburger && menu) {
  hamburger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Datos de proyectos
const proyectos = [
  {
    titulo: "Predicción de un aterrizaje de un cohete marítimo usando un algoritmo de aprendizaje automático",
    desc: "",
    tags: ["Python", "Jupyter Notebook", "pandas", "numpy", "seaborn", "scikit-learn"],
    rol: "Desarrollador y analista de datos.",
    res: "Algoritmo de predicción automática.",
    link: "https://github.com/Peristroff/IBM-DataScienceCapstone/blob/main/Module%204/SpaceX-Machine-Learning-Prediction-Part-5-v1.ipynb",
    img: "https://raw.githubusercontent.com/Peristroff/Mi-portafolio/refs/heads/Pablo/resources/Imagen1.png"
  },
  {
    titulo: "Análisis de crímenes en la ciudad de Chicago utilizando SQL",
    desc: "",
    rol: "Desarrollador principal y analista de datos",
    res: "Análisis de datos.",
    tags: ["Jupyter", "SQLite 3", "pandas"],
    link: "https://github.com/Peristroff/IBM-CrimeDataAnalysis/blob/main/mod5-final-project-v2.ipynb",
    img: "https://raw.githubusercontent.com/Peristroff/Mi-portafolio/dcb0bc1fe3769e2e5c4fefbfbf73e8f7fbeda5ae/resources/Imagen2.png"
  },
  {
    titulo: "Comparador de precios de productos en locales de abarrotes",
    desc: "Repositorio privado.<br>El núcleo de la propuesta consiste en realizar una aplicación móvil que permita a los usuarios:<br> -	Buscar y agregar productos.<br>  -	Comparar dichos productos con sus precios.<br>  -	Buscar y agregar locales con su ubicación georreferenciada.",
    rol: "Desarrollador fullstack",
    res: "Aplicación de Android con impacto en la sociedad.",
    tags: ["React Native", "MMKV", "autocomplete-dropdown", "maps", "Android"],
    link: "",
    img: "https://raw.githubusercontent.com/Peristroff/Mi-portafolio/dcb0bc1fe3769e2e5c4fefbfbf73e8f7fbeda5ae/resources/Imagen3.png"
  }
];

// Render tarjetas accesibles
const grid = document.getElementById('cards-proyectos');
if (grid) {
  const html = proyectos.map(p => `
    <article class="card reveal" role="listitem">
      <a href="${p.link}" target="_blank" rel="noopener" aria-label="Abrir repositorio de ${p.titulo}">
        <img src="${p.img}" alt="${p.titulo}" loading="lazy" />
      </a>
      <div class="body">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px">
          <h3 style="margin:0; font-size:18px">${p.titulo}</h3>
          <a class="badge" href="${p.link}" target="_blank" rel="noopener" aria-label="Ir al repositorio de ${p.titulo}">Repositorio</a>
        </div>
        <p class="muted" style="margin:8px 0 6px">${p.desc}</p>

        <!-- NUEVO: rol y resultados -->
        <div class="meta">
          <div class="kv"><span class="k">Rol:</span> <span class="v">${p.rol ?? "—"}</span></div>
          <div class="kv"><span class="k">Aporte:</span> <span class="v">${p.res ?? "—"}</span></div>
        </div>
        
        <div class="stack">${p.tags.map(t => `<span class="badge">${t}</span>`).join('')}</div>
      </div>
    </article>
  `).join('');
  grid.innerHTML = html;
}

// Scroll suave con compensación por header fijo
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerEl = document.querySelector('.header');
    const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.pushState(null, '', href);
  });
});

// Resaltar menú según sección en viewport
const sectionIds = ['#proyectos', '#experiencia', '#areas', '#servicios', '#certificaciones', '#reconocimientos', '#skills', '#contacto'];
const links = sectionIds.map(id => [id, document.querySelector(`.menu a[href="${id}"]`)]);
const headerEl2 = document.querySelector('.header');

const onScroll = () => {
  let current = null;
  const headerH = headerEl2 ? headerEl2.getBoundingClientRect().height : 0;
  const probe = headerH + 12; // línea virtual debajo del header
  for (const [id] of links) {
    const el = document.querySelector(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= probe && rect.bottom >= probe) current = id;
  }
  links.forEach(([id, link]) => {
    if (!link) return;
    link.classList.toggle('active', id === current);
  });
};
document.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

// Animaciones con IntersectionObserver (respeta reduce-motion)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// === Navbar: aplicar sombra/solidez al hacer scroll ===
const header = document.querySelector('.header');
const setHeaderScrolled = () => {
  if (!header) return;
  const scrolled = window.scrollY > 10;
  header.classList.toggle('scrolled', scrolled);
};
document.addEventListener('scroll', setHeaderScrolled, { passive: true });
window.addEventListener('load', setHeaderScrolled);

// === Botón “Volver arriba” ===
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  const toggleTop = () => {
    const show = window.scrollY > 500;
    backToTop.classList.toggle('show', show);
  };
  document.addEventListener('scroll', toggleTop, { passive: true });
  window.addEventListener('load', toggleTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}