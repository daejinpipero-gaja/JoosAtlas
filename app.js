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

  const localScales = {7:27.815, 9:41.079, 12:61.782};

  const quickLab = document.querySelector('[data-quick-lab]');
  if (quickLab) {
    const effectEl = quickLab.querySelector('#quick-ground-effect');
    const captionEl = quickLab.querySelector('#quick-lab-caption');
    const observedCircle = quickLab.querySelector('.quick-circle.observed');
    const observedLine = quickLab.querySelector('.quick-observed-line');
    quickLab.querySelectorAll('[data-distance]').forEach(btn => btn.addEventListener('click', () => {
      const distance = Number(btn.dataset.distance);
      const scale = localScales[distance];
      const effectCm = scale * 2 / 10;
      quickLab.querySelectorAll('[data-distance]').forEach(b => b.classList.toggle('active', b === btn));
      effectEl.textContent = `${effectCm.toFixed(1)} cm`;
      captionEl.textContent = `At ${distance} m, the selected local scale is approximately ${scale.toFixed(1)} mm/px.`;
      observedLine.style.transform = `translateX(${Math.min(34, effectCm*2.1)}px)`;
      observedCircle.style.transform = `translate(-50%,-50%) scale(${1 + effectCm/110})`;
    }));
  }

  const pixelLab = document.querySelector('[data-pixel-lab]');
  if (pixelLab) {
    let distance = 7;
    let revealed = false;
    let compareTimer = null;
    const slider = pixelLab.querySelector('#pixel-shift');
    const pxValue = pixelLab.querySelector('#pixel-shift-value');
    const scaleEl = pixelLab.querySelector('#lab-scale');
    const effectEl = pixelLab.querySelector('#lab-effect');
    const toleranceEl = pixelLab.querySelector('#lab-tolerance');
    const status = pixelLab.querySelector('#lab-status');
    const meter = pixelLab.querySelector('#lab-meter-fill');
    const imageBoundary = pixelLab.querySelector('#sim-image-boundary');
    const groundBoundary = pixelLab.querySelector('#sim-ground-boundary');
    const pixelLabel = pixelLab.querySelector('#sim-pixel-label');
    const gapLabel = pixelLab.querySelector('#ground-gap-label');
    const gap = pixelLab.querySelector('#ground-gap');
    const revealBtn = pixelLab.querySelector('#reveal-tolerance');
    const compareBtn = pixelLab.querySelector('#compare-two-pixels');

    const renderLab = () => {
      const px = Number(slider.value);
      const scale = localScales[distance];
      const effectMm = px * scale;
      const effectCm = effectMm / 10;
      const tolerancePx = 50 / scale;
      const pass = effectMm <= 50 + 1e-6;
      pxValue.textContent = `${px.toFixed(1)} px`;
      scaleEl.textContent = `${scale.toFixed(1)} mm/px`;
      effectEl.textContent = `${effectCm.toFixed(1)} cm`;
      pixelLabel.textContent = `${px.toFixed(1)} px`;
      gapLabel.textContent = `${effectCm.toFixed(1)} cm`;
      toleranceEl.textContent = revealed ? `${tolerancePx.toFixed(2)} px` : 'Hidden';
      const meterPct = Math.min(100, effectMm / 150 * 100);
      meter.style.width = `${meterPct}%`;
      meter.classList.toggle('over', !pass);
      imageBoundary.style.transform = `translateX(${px * 12}px)`;
      groundBoundary.style.transform = `translate(-50%,-50%) scale(${1 + effectCm/90})`;
      gap.style.width = `${Math.max(24, Math.min(120, effectCm * 8))}px`;
      status.classList.toggle('pass', pass);
      status.classList.toggle('fail', !pass);
      status.querySelector('strong').textContent = pass ? 'WITHIN 5 CM' : 'BEYOND 5 CM';
      status.querySelector('p').textContent = pass ? 'The selected displacement remains inside the challenge threshold.' : `At ${distance} m, ${px.toFixed(1)} px produces approximately ${effectCm.toFixed(1)} cm in this selected local geometry.`;
    };

    pixelLab.querySelectorAll('[data-lab-distance]').forEach(btn => btn.addEventListener('click', () => {
      distance = Number(btn.dataset.labDistance);
      pixelLab.querySelectorAll('[data-lab-distance]').forEach(b => b.classList.toggle('active', b === btn));
      renderLab();
    }));
    slider.addEventListener('input', renderLab);
    revealBtn.addEventListener('click', () => {
      revealed = !revealed;
      revealBtn.textContent = revealed ? 'Hide tolerance' : 'Reveal tolerance';
      renderLab();
    });
    compareBtn.addEventListener('click', () => {
      if (compareTimer) { clearInterval(compareTimer); compareTimer = null; compareBtn.textContent='Compare 2 px across distances'; return; }
      slider.value = 2;
      const sequence=[7,9,12]; let i=0;
      const step=()=>{
        distance=sequence[i%sequence.length];
        pixelLab.querySelectorAll('[data-lab-distance]').forEach(b=>b.classList.toggle('active', Number(b.dataset.labDistance)===distance));
        renderLab(); i++;
      };
      step(); compareBtn.textContent='Stop comparison';
      compareTimer=setInterval(step,1500);
    });
    renderLab();
  }

})();

/* =========================================================
   V8 interactions
   ========================================================= */
(() => {
  const game = document.querySelector('[data-audit-game]');
  if (game) {
    const rounds = [
      {
        kicker:'A CLEAN OVERLAY',
        question:'The projected line visually matches the field mark. Is the boundary verified?',
        correct:'withhold',
        explanation:'Not yet. Visual agreement is only an observation. The image cannot provide an independent reference for its own interpretation.',
        status:'IMAGE ONLY',
        stage:'stage-one'
      },
      {
        kicker:'REFERENCE ENTERS',
        question:'Independent reference points agree locally, but the final object-space discrepancy has not been checked. Permit the claim?',
        correct:'withhold',
        explanation:'Still not yet. Local agreement is useful, but it does not establish terminal validity after projection and back-projection.',
        status:'LOCAL CHECK',
        stage:'stage-two'
      },
      {
        kicker:'TERMINAL AUDIT',
        question:'Observability, geometric consistency and the signed terminal audit all pass the declared rule. Permit the claim?',
        correct:'permit',
        explanation:'Yes. The claim is now earned by the complete chain—not by appearance alone.',
        status:'CLAIM READY',
        stage:'stage-three'
      }
    ];
    let index = 0;
    let score = 0;
    let locked = false;
    const visual = game.querySelector('#game-visual');
    const roundEl = game.querySelector('#game-round');
    const bar = game.querySelector('#game-progress-bar');
    const scoreEl = game.querySelector('#game-score');
    const kicker = game.querySelector('#game-kicker');
    const question = game.querySelector('#game-question');
    const status = game.querySelector('#game-status-chip');
    const feedback = game.querySelector('#game-feedback');
    const next = game.querySelector('#game-next');
    const replay = game.querySelector('#game-replay');
    const caseLink = game.querySelector('#game-case-link');
    const answerButtons = [...game.querySelectorAll('[data-answer]')];

    const renderRound = () => {
      const r = rounds[index];
      locked = false;
      visual.classList.remove('stage-one','stage-two','stage-three');
      visual.classList.add(r.stage);
      roundEl.textContent = `ROUND ${index + 1} / ${rounds.length}`;
      bar.style.width = `${((index + 1) / rounds.length) * 100}%`;
      scoreEl.textContent = `SCORE ${score}`;
      kicker.textContent = r.kicker;
      question.textContent = r.question;
      status.textContent = r.status;
      feedback.className = 'game-feedback';
      feedback.innerHTML = '<strong>Choose a decision.</strong><p>The explanation will appear here.</p>';
      answerButtons.forEach(b => { b.disabled = false; b.classList.remove('is-correct','is-wrong'); });
      next.disabled = true;
      next.hidden = false;
      replay.hidden = true;
      caseLink.hidden = true;
      next.textContent = index === rounds.length - 1 ? 'SEE RESULT →' : 'NEXT ROUND →';
    };

    answerButtons.forEach(btn => btn.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      const answer = btn.dataset.answer;
      const r = rounds[index];
      const correct = answer === r.correct;
      if (correct) score += 1;
      scoreEl.textContent = `SCORE ${score}`;
      answerButtons.forEach(b => {
        b.disabled = true;
        if (b.dataset.answer === r.correct) b.classList.add('is-correct');
      });
      if (!correct) btn.classList.add('is-wrong');
      feedback.className = `game-feedback ${correct ? 'correct' : 'wrong'}`;
      feedback.innerHTML = `<strong>${correct ? 'CORRECT DECISION' : 'VISUAL SHORTCUT DETECTED'}</strong><p>${r.explanation}</p>`;
      next.disabled = false;
    }));

    next.addEventListener('click', () => {
      if (!locked) return;
      if (index < rounds.length - 1) {
        index += 1;
        renderRound();
      } else {
        roundEl.textContent = 'AUDIT COMPLETE';
        bar.style.width = '100%';
        kicker.textContent = score === rounds.length ? 'CLAIM DISCIPLINE / 3 OF 3' : `CLAIM DISCIPLINE / ${score} OF 3`;
        question.textContent = score === rounds.length ? 'You resisted the visual shortcut.' : 'The evidence chain can be replayed.';
        status.textContent = score === rounds.length ? 'CLAIM EARNED' : 'REVIEW NEEDED';
        feedback.className = `game-feedback ${score === rounds.length ? 'correct' : 'wrong'}`;
        feedback.innerHTML = `<strong>${score === rounds.length ? 'COMPLETE CHAIN RECOGNIZED' : 'PARTIAL CHAIN RECOGNIZED'}</strong><p>${score === rounds.length ? 'A measurement claim becomes defensible only after observation, independent reference and terminal audit remain distinct and all pass.' : 'The exercise is designed to make the tempting shortcut visible. Try again or open the full case.'}</p>`;
        answerButtons.forEach(b => b.hidden = true);
        next.hidden = true;
        replay.hidden = false;
        caseLink.hidden = false;
      }
    });

    replay.addEventListener('click', () => {
      index = 0; score = 0;
      answerButtons.forEach(b => b.hidden = false);
      renderRound();
    });
    renderRound();
  }

  const sandbox = document.querySelector('[data-projection-sandbox]');
  if (sandbox) {
    const distance = sandbox.querySelector('#distance-slider');
    const pixel = sandbox.querySelector('#pixel-slider');
    const angle = sandbox.querySelector('#angle-slider');
    const distanceOut = sandbox.querySelector('#distance-output');
    const pixelOut = sandbox.querySelector('#pixel-output');
    const angleOut = sandbox.querySelector('#angle-output');
    const resultOut = sandbox.querySelector('#projection-result-value');
    const ellipse = sandbox.querySelector('#projection-footprint');
    const rayA = sandbox.querySelector('#projection-ray-a');
    const rayB = sandbox.querySelector('#projection-ray-b');
    const normal = sandbox.querySelector('#projection-normal');

    const update = () => {
      const z = Number(distance.value);
      const du = Number(pixel.value);
      const theta = Number(angle.value) * Math.PI / 180;
      const mm = (z * du / Math.max(.35, Math.cos(theta)));
      distanceOut.value = `${z.toFixed(1)} m`;
      pixelOut.value = `${du.toFixed(2).replace(/\.00$/,'')} px`;
      angleOut.value = `${Math.round(Number(angle.value))}°`;
      resultOut.textContent = `${mm.toFixed(1)} mm`;
      const width = Math.max(22, Math.min(118, 18 + mm * 2.2));
      const height = Math.max(8, Math.min(40, 7 + mm * .55));
      ellipse.setAttribute('rx', width.toFixed(1));
      ellipse.setAttribute('ry', height.toFixed(1));
      const endX = 580 + z * 8;
      const spread = 18 + du * 8 + Number(angle.value) * .35;
      rayA.setAttribute('d', `M180 106L${(endX-spread).toFixed(1)} 350`);
      rayB.setAttribute('d', `M180 106L${(endX+spread).toFixed(1)} 350`);
      ellipse.setAttribute('cx', endX.toFixed(1));
      normal.setAttribute('x1', endX.toFixed(1));
      normal.setAttribute('x2', endX.toFixed(1));
    };
    [distance,pixel,angle].forEach(el => el.addEventListener('input', update));
    sandbox.querySelectorAll('[data-projection-preset]').forEach(btn => btn.addEventListener('click', () => {
      const p = btn.dataset.projectionPreset;
      if (p === 'near') { distance.value=5; pixel.value=1; angle.value=10; }
      if (p === 'field') { distance.value=9; pixel.value=2; angle.value=25; }
      if (p === 'far') { distance.value=14; pixel.value=3; angle.value=55; }
      update();
    }));
    update();
  }

  const localScales = {7:27.815, 9:41.079, 12:61.782};

  const quickLab = document.querySelector('[data-quick-lab]');
  if (quickLab) {
    const effectEl = quickLab.querySelector('#quick-ground-effect');
    const captionEl = quickLab.querySelector('#quick-lab-caption');
    const observedCircle = quickLab.querySelector('.quick-circle.observed');
    const observedLine = quickLab.querySelector('.quick-observed-line');
    quickLab.querySelectorAll('[data-distance]').forEach(btn => btn.addEventListener('click', () => {
      const distance = Number(btn.dataset.distance);
      const scale = localScales[distance];
      const effectCm = scale * 2 / 10;
      quickLab.querySelectorAll('[data-distance]').forEach(b => b.classList.toggle('active', b === btn));
      effectEl.textContent = `${effectCm.toFixed(1)} cm`;
      captionEl.textContent = `At ${distance} m, the selected local scale is approximately ${scale.toFixed(1)} mm/px.`;
      observedLine.style.transform = `translateX(${Math.min(34, effectCm*2.1)}px)`;
      observedCircle.style.transform = `translate(-50%,-50%) scale(${1 + effectCm/110})`;
    }));
  }

  const pixelLab = document.querySelector('[data-pixel-lab]');
  if (pixelLab) {
    let distance = 7;
    let revealed = false;
    let compareTimer = null;
    const slider = pixelLab.querySelector('#pixel-shift');
    const pxValue = pixelLab.querySelector('#pixel-shift-value');
    const scaleEl = pixelLab.querySelector('#lab-scale');
    const effectEl = pixelLab.querySelector('#lab-effect');
    const toleranceEl = pixelLab.querySelector('#lab-tolerance');
    const status = pixelLab.querySelector('#lab-status');
    const meter = pixelLab.querySelector('#lab-meter-fill');
    const imageBoundary = pixelLab.querySelector('#sim-image-boundary');
    const groundBoundary = pixelLab.querySelector('#sim-ground-boundary');
    const pixelLabel = pixelLab.querySelector('#sim-pixel-label');
    const gapLabel = pixelLab.querySelector('#ground-gap-label');
    const gap = pixelLab.querySelector('#ground-gap');
    const revealBtn = pixelLab.querySelector('#reveal-tolerance');
    const compareBtn = pixelLab.querySelector('#compare-two-pixels');

    const renderLab = () => {
      const px = Number(slider.value);
      const scale = localScales[distance];
      const effectMm = px * scale;
      const effectCm = effectMm / 10;
      const tolerancePx = 50 / scale;
      const pass = effectMm <= 50 + 1e-6;
      pxValue.textContent = `${px.toFixed(1)} px`;
      scaleEl.textContent = `${scale.toFixed(1)} mm/px`;
      effectEl.textContent = `${effectCm.toFixed(1)} cm`;
      pixelLabel.textContent = `${px.toFixed(1)} px`;
      gapLabel.textContent = `${effectCm.toFixed(1)} cm`;
      toleranceEl.textContent = revealed ? `${tolerancePx.toFixed(2)} px` : 'Hidden';
      const meterPct = Math.min(100, effectMm / 150 * 100);
      meter.style.width = `${meterPct}%`;
      meter.classList.toggle('over', !pass);
      imageBoundary.style.transform = `translateX(${px * 12}px)`;
      groundBoundary.style.transform = `translate(-50%,-50%) scale(${1 + effectCm/90})`;
      gap.style.width = `${Math.max(24, Math.min(120, effectCm * 8))}px`;
      status.classList.toggle('pass', pass);
      status.classList.toggle('fail', !pass);
      status.querySelector('strong').textContent = pass ? 'WITHIN 5 CM' : 'BEYOND 5 CM';
      status.querySelector('p').textContent = pass ? 'The selected displacement remains inside the challenge threshold.' : `At ${distance} m, ${px.toFixed(1)} px produces approximately ${effectCm.toFixed(1)} cm in this selected local geometry.`;
    };

    pixelLab.querySelectorAll('[data-lab-distance]').forEach(btn => btn.addEventListener('click', () => {
      distance = Number(btn.dataset.labDistance);
      pixelLab.querySelectorAll('[data-lab-distance]').forEach(b => b.classList.toggle('active', b === btn));
      renderLab();
    }));
    slider.addEventListener('input', renderLab);
    revealBtn.addEventListener('click', () => {
      revealed = !revealed;
      revealBtn.textContent = revealed ? 'Hide tolerance' : 'Reveal tolerance';
      renderLab();
    });
    compareBtn.addEventListener('click', () => {
      if (compareTimer) { clearInterval(compareTimer); compareTimer = null; compareBtn.textContent='Compare 2 px across distances'; return; }
      slider.value = 2;
      const sequence=[7,9,12]; let i=0;
      const step=()=>{
        distance=sequence[i%sequence.length];
        pixelLab.querySelectorAll('[data-lab-distance]').forEach(b=>b.classList.toggle('active', Number(b.dataset.labDistance)===distance));
        renderLab(); i++;
      };
      step(); compareBtn.textContent='Stop comparison';
      compareTimer=setInterval(step,1500);
    });
    renderLab();
  }

})();
