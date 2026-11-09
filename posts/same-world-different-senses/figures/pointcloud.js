// Turnable point clouds. Each <div class="pointcloud" data-points="x,y,z,..." data-view="9 numbers">
// gets a canvas drawing; data-view rows are the screen-right, screen-up and depth directions.
document.querySelectorAll('.pointcloud:not([data-ready])').forEach(box => {
  box.dataset.ready = '1';
  const canvas = box.querySelector('canvas'), ctx = canvas.getContext('2d');
  const raw = box.dataset.points.split(',').map(Number);
  // Center the points and scale them to fit a unit sphere.
  const V = (box.dataset.view || '1,0,0,0,1,0,0,0,1').split(',').map(Number);
  const n = raw.length / 3, c = [0, 0, 0];
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) c[k] += raw[3*i+k] / n;
  let r = 0; const P = [];
  for (let i = 0; i < n; i++) {
    const d = [raw[3*i]-c[0], raw[3*i+1]-c[1], raw[3*i+2]-c[2]];
    const p = [0, 1, 2].map(r => V[3*r]*d[0] + V[3*r+1]*d[1] + V[3*r+2]*d[2]);
    r = Math.max(r, Math.hypot(...p)); P.push(p);
  }
  P.forEach(p => { p[0] /= r; p[1] /= r; p[2] /= r; });
  let yaw = 0, pitch = 0.25, size = 0, drag = null, last = 0, visible = true;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() {
    const w = canvas.clientWidth, dpr = window.devicePixelRatio || 1;
    size = w; canvas.width = w * dpr; canvas.height = w * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  }
  function draw() {
    if (!size) return;
    ctx.clearRect(0, 0, size, size);
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const q = P.map(([x, y, z]) => {
      const x1 = cy*x + sy*z, z1 = -sy*x + cy*z;      // turn around the vertical axis
      const y2 = cp*y - sp*z1, z2 = sp*y + cp*z1;     // then tilt
      return [x1, y2, z2];
    }).sort((a, b) => a[2] - b[2]);                   // far points first
    const s = size * 0.42, mid = size / 2;
    for (const [x, y, z] of q) {
      const t = (z + 1) / 2;                          // 0 = far, 1 = near
      ctx.fillStyle = `rgba(${Math.round(150 - 90*t)}, ${Math.round(170 - 45*t)}, ${Math.round(150 - 85*t)}, ${0.35 + 0.6*t})`;
      ctx.beginPath(); ctx.arc(mid + x*s, mid - y*s, 1.3 + 1.8*t, 0, 6.2832); ctx.fill();
    }
  }
  function tick(time) {
    if (!drag && !still && visible) yaw += Math.min(time - last, 50) * 0.00035;
    last = time; draw(); requestAnimationFrame(tick);
  }
  canvas.addEventListener('pointerdown', e => { drag = [e.clientX, e.clientY, yaw, pitch]; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!drag) return;
    yaw = drag[2] + (e.clientX - drag[0]) * 0.01;
    pitch = Math.max(-1.5, Math.min(1.5, drag[3] + (e.clientY - drag[1]) * 0.01));
    draw();
  });
  const end = () => { drag = null; };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(canvas);
  new ResizeObserver(resize).observe(canvas);
  resize(); requestAnimationFrame(t => { last = t; tick(t); });
});
