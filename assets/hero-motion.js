/* Paymove hero A/B · sekwencja: głos → koszyk → BLIK → zapłacono → bilet. data-mark dla stageshow film --at. */
(() => {
  const st = document.getElementById('hx-stage'); if (!st) return;
  const STEPS = [['listen', 0], ['q', 300], ['cart', 2700], ['blik', 3900], ['paid', 5700], ['ticket', 6700]];
  const LOOP = 11500, ALL = STEPS.map(([k]) => 's-' + k);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const set = (k) => { st.classList.add('s-' + k); if (k !== 'q') st.dataset.mark = k; };
  const fz = new URLSearchParams(location.search).get('static');
  if (fz !== null) { /* zamrożony kadr do bramek: ?static=blik itd. */
    document.body.classList.add('hx-static'); const end = STEPS.findIndex(([k]) => k === (fz || 'ticket'));
    STEPS.slice(0, end < 0 ? STEPS.length : end + 1).forEach(([k]) => set(k)); return;
  }
  if (reduce) { STEPS.forEach(([k]) => set(k)); return; }
  let timers = [];
  const run = () => {
    timers.forEach(clearTimeout); timers = [];
    STEPS.forEach(([k, t]) => timers.push(setTimeout(() => set(k), t)));
    timers.push(setTimeout(() => {
      st.classList.add('rewind'); st.classList.remove(...ALL); st.dataset.mark = 'rewind';
      timers.push(setTimeout(() => { st.classList.remove('rewind'); run(); }, 500));
    }, LOOP));
  };
  let started = false;
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !started) { started = true; run(); } }), { threshold: .2 }).observe(st);
})();
