(function () {
  const root = document.querySelector("[data-stage]");
  const canvas = document.getElementById("dust");
  if (!root || !canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let targetX = 0.5;
  let targetY = 0.42;
  let lightX = 0.5;
  let lightY = 0.42;
  let time = 0;

  function setLight(x, y) {
    root.style.setProperty("--lx", (x * 100).toFixed(2) + "%");
    root.style.setProperty("--ly", (y * 100).toFixed(2) + "%");
  }

  setLight(lightX, lightY);
  if (reduce) return;

  const context = canvas.getContext("2d");
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: 0.4 + Math.random() * 0.6,
    drift: 0.00025 + Math.random() * 0.00045,
  }));

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(root.clientWidth * ratio);
    canvas.height = Math.floor(root.clientHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    const width = root.clientWidth;
    const height = root.clientHeight;
    context.clearRect(0, 0, width, height);

    const lampX = lightX * width;
    const lampY = 88;
    const poolX = lightX * width;
    const poolY = lightY * height;
    const cone = context.createLinearGradient(lampX, lampY, poolX, poolY + height * 0.18);
    cone.addColorStop(0, "rgba(240, 210, 160, 0.08)");
    cone.addColorStop(0.55, "rgba(240, 210, 160, 0.03)");
    cone.addColorStop(1, "rgba(240, 210, 160, 0)");
    context.fillStyle = cone;
    context.beginPath();
    context.moveTo(lampX - 8, lampY);
    context.lineTo(lampX + 8, lampY);
    context.lineTo(poolX + width * 0.22, poolY + height * 0.2);
    context.lineTo(poolX - width * 0.22, poolY + height * 0.2);
    context.closePath();
    context.fill();

    particles.forEach((particle) => {
      particle.y -= particle.drift;
      particle.x += Math.sin(time + particle.y * 8) * 0.00015;
      if (particle.y < -0.02) {
        particle.y = 1.02;
        particle.x = Math.random();
      }

      const dx = (particle.x - lightX) / 0.22;
      const dy = (particle.y - lightY) / 0.34;
      const falloff = 1 - Math.min(1, dx * dx + dy * dy);
      if (falloff <= 0.05) return;

      context.fillStyle = "rgba(241, 226, 190," + (0.08 + falloff * 0.45 * particle.z) + ")";
      context.beginPath();
      context.arc(particle.x * width, particle.y * height, 0.6 + particle.z * 1.3, 0, Math.PI * 2);
      context.fill();
    });
  }

  function tick() {
    time += 0.012;
    lightX += (targetX - lightX) * 0.055;
    lightY += (targetY - lightY) * 0.055;
    setLight(
      lightX + Math.sin(time * 0.35) * 0.01,
      lightY + Math.cos(time * 0.28) * 0.008
    );
    draw();
    requestAnimationFrame(tick);
  }

  function follow(event) {
    const bounds = root.getBoundingClientRect();
    const point = event.touches ? event.touches[0] : event;
    targetX = (point.clientX - bounds.left) / bounds.width;
    targetY = (point.clientY - bounds.top) / bounds.height;
  }

  root.addEventListener("pointermove", follow);
  root.addEventListener("touchmove", follow, { passive: true });
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
})();
