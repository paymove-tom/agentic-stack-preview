/* Paymove Agentic Stack · www v3.1 · interakcje (vanilla, bez zależności) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- taby (klik + strzałki, roving tabindex) ---------- */
  function tablist(list, onSelect) {
    const tabs = $$('[role=tab]', list);
    const select = (t, focus) => {
      tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
      if (focus) t.focus();
      onSelect(t);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  }

  /* ---------- głos: scenariusze ---------- */
  const SCN = {
    zoo: { c1: 'Dwa normalne i jeden ulgowy na sobotę.', a1: 'Razem 121,00 zł. Płacisz BLIK-iem?', c2: 'Tak.', t: 'ZOO · 2 normalne + 1 ulgowy', amt: '121,00 zł',
      pq: 'Poproszę dwa normalne i jeden ulgowy.', ct: 'Bilety wstępu', r1: 'Normalny', d1: 'Dorośli 18+', p1: '45,00 zł', q1: '2', r2: 'Ulgowy', d2: 'Dzieci 3–18 lat', p2: '30,00 zł', q2: '1', cnt: '3', tot: '121,00 zł', i1: 'ri-user-line', i2: 'ri-bear-smile-line' },
    park: { c1: 'Parking przy Dworcu Centralnym na dwie godziny.', a1: 'Strefa A, 2 godziny: 12,00 zł. Płacisz BLIK-iem?', c2: 'Tak.', t: 'Parking · Dworzec Centralny · 2 h', amt: '12,00 zł',
      pq: 'Parking przy Dworcu na dwie godziny.', ct: 'Parking · strefa A', r1: 'Pierwsza godzina', d1: 'Strefa A', p1: '6,00 zł', q1: '1', r2: 'Kolejna godzina', d2: 'Strefa A', p2: '6,00 zł', q2: '1', cnt: '2', tot: '12,00 zł', i1: 'ri-parking-box-line', i2: 'ri-time-line' },
  };
  const voice = $('#glos');
  let timers = [];
  function play() {
    timers.forEach(clearTimeout); timers = [];
    const lines = $$('.convo .line', voice);
    lines.forEach(l => l.classList.remove('on'));
    lines.forEach((l, i) => timers.push(setTimeout(() => l.classList.add('on'), reduce ? 0 : 150 + i * 650)));
  }
  function scenario(key) {
    const d = SCN[key];
    $$('[data-k]', voice).forEach(el => { if (d[el.dataset.k] != null) el.textContent = d[el.dataset.k]; });
    $$('[data-ki]', voice).forEach(el => { el.className = d[el.dataset.ki]; });
    const pay = $('[data-pay]', voice); pay.dataset.paid = 'false'; pay.querySelector('.pb-l').textContent = 'Zapłać głosowo'; pay.querySelector('i').className = 'ri-mic-fill';
    $('#voice-panel').setAttribute('aria-labelledby', key === 'zoo' ? 't-zoo' : 't-park');
    play();
  }
  if (voice) {
    tablist($('[role=tablist]', voice), t => scenario(t.dataset.scn));
    $('[data-pay]', voice).addEventListener('click', e => {
      const b = e.currentTarget, paid = b.dataset.paid === 'true';
      b.dataset.paid = String(!paid);
      b.querySelector('.pb-l').textContent = paid ? 'Zapłać głosowo' : 'Zapłacono BLIK-iem';
      b.querySelector('i').className = paid ? 'ri-mic-fill' : 'ri-check-line';
    });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { play(); io.disconnect(); } }), { threshold: .3 });
    io.observe(voice);
    $$('.convo .line', voice).forEach(l => l.classList.add('on'));   // treść widoczna bez JS-owej animacji (no-JS, zrzuty)
  }

  /* ---------- terminal: klient MCP ---------- */
  const CLI = {
    claude: 'claude mcp add --transport http <em>paymove</em> <u>https://api.paymove.io/api/mcp</u>',
    cursor: '{ "mcpServers": { "<em>paymove</em>": { "url": "<u>https://api.paymove.io/api/mcp</u>" } } }',
    partner: 'claude mcp add --transport http <em>paymove</em> <u>https://api.paymove.io/api/mcp</u> --header "X-API-KEY: $PAYMOVE_KEY"',
  };
  const term = $('#mock-term');
  if (term) tablist($('[role=tablist]', term), t => {
    $('#term-cmd').innerHTML = CLI[t.dataset.cli];
    $('.cmd b', term).textContent = t.dataset.cli === 'cursor' ? '' : '$';
    $('#term-out').firstElementChild.textContent = t.dataset.cli === 'partner' ? '→ Połączono z kluczem · 20 narzędzi' : '→ Połączono · 20 narzędzi';
  });

  /* ---------- kopiuj ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const txt = $(b.dataset.copy).innerText.trim(); const lab = b.querySelector('span');
    try { await navigator.clipboard.writeText(txt); lab.textContent = 'Skopiowano'; }
    catch { const r = document.createRange(); r.selectNodeContents($(b.dataset.copy)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); lab.textContent = 'Zaznaczono'; }
    b.querySelector('i').className = 'ri-check-line';
    setTimeout(() => { lab.textContent = 'Kopiuj'; b.querySelector('i').className = 'ri-file-copy-line'; }, 1800);
  }));

  /* ---------- portfel: zamrożenie + zatwierdzanie ---------- */
  const w = $('#mock-wallet');
  if (w) {
    const sw = $('#w-freeze', w), st = $('#w-status', w);
    sw.addEventListener('click', () => {
      const on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', on); w.classList.toggle('w-frozen', on);
      st.textContent = on ? 'Zamrożony' : 'Aktywny'; sw.textContent = on ? 'Odmroź' : 'Zamroź';
      $$('[data-act]', w).forEach(b => b.disabled = on);
    });
    $$('[data-act]', w).forEach(b => b.addEventListener('click', () => {
      const ok = b.dataset.act === 'approve', pend = $('#w-pend', w);
      const row = document.createElement('div'); row.className = 'h-row';
      row.innerHTML = `<div><div class="w-strong">Parking · Dworzec Centralny</div><div class="w-sub">teraz · ${ok ? 'BLIK' : 'odrzucone'}</div></div><div class="h-amt"><b>12,00 zł</b><span>${ok ? 'Zatwierdzone' : 'Odrzucone'}</span></div>`;
      $('#w-hist', w).prepend(row);
      $('#w-pend-n', w).textContent = '0';
      pend.innerHTML = `<div class="w-sub">Nic nie czeka na zatwierdzenie.</div><button class="w-btn ghost" data-reset>Cofnij demo</button>`;
      $('[data-reset]', pend).addEventListener('click', () => location.reload());
    }));
  }

  /* ---------- menu mobilne ---------- */
  const nav = $('.nav'), mb = $('.nav-menu');
  if (mb) {
    mb.addEventListener('click', () => { const o = !nav.classList.contains('open'); nav.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); mb.firstElementChild.className = o ? 'ri-close-line' : 'ri-menu-line'; });
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.firstElementChild.className = 'ri-menu-line'; }));
  }

  /* ---------- karuzela filarów (≤ 900 px): przyciski, kropki, klawiatura, swipe ---------- */
  const car = $('#filary-car');
  if (car) {
    const track = $('[data-track]', car), tiles = $$('.tile', track), dots = $('.dots', car);
    const prev = $('[data-prev]', car), next = $('[data-next]', car);
    const mq = matchMedia('(max-width: 900px)');
    tiles.forEach((t, i) => { const d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', `Filar ${i + 1} z ${tiles.length}`); d.addEventListener('click', () => go(i)); dots.append(d); });
    const idx = () => { const x = track.scrollLeft; let best = 0, bd = 1e9; tiles.forEach((t, i) => { const dd = Math.abs((t.offsetLeft - tiles[0].offsetLeft) - x); if (dd < bd) { bd = dd; best = i; } }); return best; };
    function go(i) { i = Math.max(0, Math.min(tiles.length - 1, i)); track.scrollTo({ left: tiles[i].offsetLeft - tiles[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); }
    function sync() {
      const i = idx();
      $$('button', dots).forEach((d, k) => d.setAttribute('aria-current', k === i));
      tiles.forEach((t, k) => t.setAttribute('aria-hidden', mq.matches && k !== i ? 'true' : 'false'));
      prev.disabled = i === 0; next.disabled = i === tiles.length - 1;
    }
    function mode() {
      if (mq.matches) { car.setAttribute('data-carousel', ''); track.tabIndex = 0; }
      else { car.removeAttribute('data-carousel'); track.removeAttribute('tabindex'); track.removeAttribute('data-track'); tiles.forEach(t => t.removeAttribute('aria-hidden')); return; }
      track.setAttribute('data-track', ''); sync();
    }
    prev.addEventListener('click', () => go(idx() - 1));
    next.addEventListener('click', () => go(idx() + 1));
    track.addEventListener('keydown', e => {
      if (!mq.matches) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx() - 1); }
    });
    let raf; track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    mq.addEventListener('change', mode); mode();
  }
})();
