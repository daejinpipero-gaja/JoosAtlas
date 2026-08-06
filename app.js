(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.main-nav');
  const progress = document.querySelector('.scroll-progress span');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
    }));
  }

  function updateProgress() {
    if (!progress) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }
  updateProgress();
  window.addEventListener('scroll', updateProgress, {passive:true});
  window.addEventListener('resize', updateProgress);

  const themedSections = [...document.querySelectorAll('[data-header-theme]')];
  if (header && themedSections.length) {
    const themeObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const theme = visible.target.dataset.headerTheme;
      header.classList.toggle('is-paper', theme === 'light');
      header.classList.toggle('is-dark', theme === 'dark');
      header.classList.remove('header-overlay');
    }, {rootMargin:'-36% 0px -55% 0px', threshold:[0,.05,.2,.5]});
    themedSections.forEach(section => themeObserver.observe(section));
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const heroImg = document.querySelector('.hero-image-wrap img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parallax = () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      heroImg.style.transform = `scale(${1.015 + y/25000}) translateY(${y * .035}px)`;
    };
    window.addEventListener('scroll', parallax, {passive:true});
  }

  const evidence = {
    C3: {
      description:'Central placement with the densest selected boundary support among the three examples.',
      rmse:'3.8 mm', mean:'−0.4 mm', max:'6.6 mm', n:'17',
      plan:'assets/images/c3-plan.webp', three:'assets/images/c3-3d.webp',
      altPlan:'C3 plan-view TS boundary validation.', alt3d:'C3 three-dimensional TS reconstruction.'
    },
    R3: {
      description:'Lateral placement with broad angular coverage and intermediate radial fit among the selected examples.',
      rmse:'7.5 mm', mean:'−0.4 mm', max:'17.0 mm', n:'16',
      plan:'assets/images/r3-plan.webp', three:'assets/images/r3-3d.webp',
      altPlan:'R3 plan-view TS boundary validation.', alt3d:'R3 three-dimensional TS reconstruction.'
    },
    D3: {
      description:'Depth placement with fewer selected boundary references and the largest RMSE of the three examples.',
      rmse:'14.0 mm', mean:'−2.8 mm', max:'19.8 mm', n:'8',
      plan:'assets/images/d3-plan.webp', three:'assets/images/d3-3d.webp',
      altPlan:'D3 plan-view TS boundary validation.', alt3d:'D3 three-dimensional TS reconstruction.'
    }
  };

  const explorer = document.querySelector('[data-evidence-explorer]');
  if (explorer) {
    let placement = 'C3';
    let view = 'plan';
    const img = explorer.querySelector('#evidence-image');
    const description = explorer.querySelector('#evidence-description');
    const placementEl = explorer.querySelector('#evidence-placement');
    const rmse = explorer.querySelector('#metric-rmse');
    const mean = explorer.querySelector('#metric-mean');
    const max = explorer.querySelector('#metric-max');
    const n = explorer.querySelector('#metric-n');

    const update = () => {
      const item = evidence[placement];
      const isPlan = view === 'plan';
      img.src = isPlan ? item.plan : item.three;
      img.alt = isPlan ? item.altPlan : item.alt3d;
      description.textContent = item.description;
      placementEl.textContent = placement;
      rmse.textContent = item.rmse;
      mean.textContent = item.mean;
      max.textContent = item.max;
      n.textContent = item.n;
    };

    explorer.querySelectorAll('[data-placement]').forEach(btn => btn.addEventListener('click', () => {
      placement = btn.dataset.placement;
      explorer.querySelectorAll('[data-placement]').forEach(b => b.classList.toggle('active', b === btn));
      update();
    }));
    explorer.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => {
      view = btn.dataset.view;
      explorer.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b === btn));
      update();
    }));
  }

  const lightbox = document.querySelector('#figure-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const close = lightbox.querySelector('.lightbox-close');
    document.querySelectorAll('[data-lightbox-target]').forEach(btn => btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.lightboxTarget);
      if (!target) return;
      lightboxImg.src = target.src;
      lightboxImg.alt = target.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      body.style.overflow = 'hidden';
      close.focus();
    }));
    const hide = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden','true');
      body.style.overflow = '';
    };
    close.addEventListener('click', hide);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) hide(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) hide(); });
  }
})();
