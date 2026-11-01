/* Paymove www v4 · ruch przy scrollu: reveal + delikatny parallax makiet. Wyłączony przy ?static i prefers-reduced-motion. */
(() => {
  const fz = new URLSearchParams(location.search).has('static');
  if (fz) document.body.classList.add('hx-static');
  if (fz || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('rv');
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  const px = matchMedia('(max-width:900px)').matches ? [] : [...document.querySelectorAll('[data-parallax]')];
  let raf = 0;
  const tick = () => {
    raf = 0; const vh = innerHeight;
    px.forEach((el) => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
      el.style.setProperty('--py', Math.max(-24, Math.min(24, (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax))).toFixed(1) + 'px'); });
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
  addEventListener('resize', tick); tick();
})();
