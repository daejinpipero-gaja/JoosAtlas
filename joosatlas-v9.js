(() => {
  'use strict';

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

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, {passive:true});
  window.addEventListener('resize', updateProgress);

  const themedSections = [...document.querySelectorAll('[data-header-theme]')];
  if (header && themedSections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const theme = visible.target.dataset.headerTheme;
      header.classList.toggle('is-paper', theme === 'light');
      header.classList.toggle('is-dark', theme === 'dark');
      header.classList.remove('header-overlay');
    }, {rootMargin:'-36% 0px -55% 0px', threshold:[0,.05,.2,.5]});
    themedSections.forEach(section => observer.observe(section));
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const heroImg = document.querySelector('.hero-image-wrap img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parallax = () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      heroImg.style.transform = `scale(${1.015 + y/25000}) translateY(${y * .035}px)`;
    };
    window.addEventListener('scroll', parallax, {passive:true});
  }

  const evidenceData = {
    C3:{description:'Central placement with the densest selected boundary support among the three examples.',rmse:'3.8 mm',mean:'−0.4 mm',max:'6.6 mm',n:'17',plan:'assets/images/c3-plan.webp',three:'assets/images/c3-3d.webp',altPlan:'C3 plan-view TS boundary validation.',alt3d:'C3 three-dimensional TS reconstruction.'},
    R3:{description:'Lateral placement with broad angular coverage and intermediate radial fit among the selected examples.',rmse:'7.5 mm',mean:'−0.4 mm',max:'17.0 mm',n:'16',plan:'assets/images/r3-plan.webp',three:'assets/images/r3-3d.webp',altPlan:'R3 plan-view TS boundary validation.',alt3d:'R3 three-dimensional TS reconstruction.'},
    D3:{description:'Depth placement with fewer selected boundary references and the largest RMSE of the three examples.',rmse:'14.0 mm',mean:'−2.8 mm',max:'19.8 mm',n:'8',plan:'assets/images/d3-plan.webp',three:'assets/images/d3-3d.webp',altPlan:'D3 plan-view TS boundary validation.',alt3d:'D3 three-dimensional TS reconstruction.'}
  };

  const explorer = document.querySelector('[data-evidence-explorer]');
  if (explorer) {
    let placement = 'C3';
    let view = 'plan';
    const update = () => {
      const item = evidenceData[placement];
      const plan = view === 'plan';
      const img = explorer.querySelector('#evidence-image');
      img.src = plan ? item.plan : item.three;
      img.alt = plan ? item.altPlan : item.alt3d;
      explorer.querySelector('#evidence-description').textContent = item.description;
      explorer.querySelector('#evidence-placement').textContent = placement;
      explorer.querySelector('#metric-rmse').textContent = item.rmse;
      explorer.querySelector('#metric-mean').textContent = item.mean;
      explorer.querySelector('#metric-max').textContent = item.max;
      explorer.querySelector('#metric-n').textContent = item.n;
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
    update();
  }

  const lightbox = document.querySelector('#figure-lightbox');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    const close = lightbox.querySelector('.lightbox-close');
    const hide = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden','true');
      body.style.overflow = '';
    };
    document.querySelectorAll('[data-lightbox-target]').forEach(btn => btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.lightboxTarget);
      if (!target) return;
      image.src = target.src;
      image.alt = target.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      body.style.overflow = 'hidden';
      close?.focus();
    }));
    close?.addEventListener('click', hide);
    lightbox.addEventListener('click', event => { if (event.target === lightbox) hide(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox.classList.contains('open')) hide(); });
  }

  const methodExplorer = document.querySelector('[data-method-explorer]');
  if (methodExplorer) {
    const tabs = [...methodExplorer.querySelectorAll('[data-method-step]')];
    const panels = [...methodExplorer.querySelectorAll('[data-method-panel]')];
    const activate = step => {
      tabs.forEach(tab => {
        const active = tab.dataset.methodStep === String(step);
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      panels.forEach(panel => {
        const active = panel.dataset.methodPanel === String(step);
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
    };
    tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.methodStep)));
    activate(1);
  }

  const lab = document.querySelector('[data-sensitivity-lab]');
  if (lab) {
    const scales = Object.freeze({7:27.815, 9:41.079, 12:61.782});
    let distance = 7;
    const slider = lab.querySelector('#sensitivity-pixels');
    const pxOutput = lab.querySelector('#sensitivity-pixel-output');
    const imageReadout = lab.querySelector('#image-readout');
    const groundReadout = lab.querySelector('#ground-readout');
    const scaleReadout = lab.querySelector('#scale-readout');
    const rangeReadout = lab.querySelector('#range-readout');
    const resultScale = lab.querySelector('#result-scale');
    const resultTolerance = lab.querySelector('#result-tolerance');
    const resultEffect = lab.querySelector('#result-effect');
    const status = lab.querySelector('#sensitivity-status');
    const imageMarker = lab.querySelector('#image-marker');
    const groundMarker = lab.querySelector('#ground-marker');

    const calculate = () => {
      const pixels = Number(slider.value);
      const scale = scales[distance];
      const effectMm = pixels * scale;
      return {pixels, scale, effectMm, effectCm:effectMm/10, tolerancePx:50/scale, pass:effectMm <= 50 + 1e-9};
    };

    const render = () => {
      const value = calculate();
      const px = `${value.pixels.toFixed(2)} px`;
      const cm = `${value.effectCm.toFixed(2)} cm`;
      pxOutput.value = px;
      pxOutput.textContent = px;
      imageReadout.textContent = px;
      groundReadout.textContent = cm;
      scaleReadout.textContent = `${value.scale.toFixed(3)} mm/px`;
      rangeReadout.textContent = `at ${distance} m`;
      resultScale.textContent = `${value.scale.toFixed(3)} mm/px`;
      resultTolerance.textContent = `${value.tolerancePx.toFixed(3)} px`;
      resultEffect.textContent = cm;
      imageMarker.style.setProperty('--position', `${Math.min(100, Math.max(0, value.pixels / 4 * 100))}%`);
      groundMarker.style.setProperty('--position', `${Math.min(100, Math.max(0, value.effectCm / 25 * 100))}%`);
      status.classList.toggle('pass', value.pass);
      status.classList.toggle('fail', !value.pass);
      status.querySelector('strong').textContent = value.pass ? 'WITHIN 5 CM' : 'ABOVE 5 CM';
      status.querySelector('p').textContent = `${value.pixels.toFixed(2)} px × ${value.scale.toFixed(3)} mm/px = ${value.effectMm.toFixed(2)} mm.`;
    };

    lab.querySelectorAll('[data-sensitivity-distance]').forEach(btn => btn.addEventListener('click', () => {
      distance = Number(btn.dataset.sensitivityDistance);
      lab.querySelectorAll('[data-sensitivity-distance]').forEach(item => item.classList.toggle('active', item === btn));
      render();
    }));
    slider.addEventListener('input', render);
    lab.querySelector('#snap-threshold')?.addEventListener('click', () => {
      const safeStep = Math.floor((50 / scales[distance]) * 100) / 100;
      slider.value = safeStep.toFixed(2);
      render();
    });
    lab.querySelector('#reset-sensitivity')?.addEventListener('click', () => {
      distance = 7;
      slider.value = '1.50';
      lab.querySelectorAll('[data-sensitivity-distance]').forEach(item => item.classList.toggle('active', Number(item.dataset.sensitivityDistance) === 7));
      render();
    });
    render();
  }
})();
