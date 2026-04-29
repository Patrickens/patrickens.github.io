(function setupPixelRain() {
  const canvas = document.getElementById("pixel-rain-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const drops = [];
  let width = 0;
  let height = 0;
  let wind = 0;
  let targetWind = 0;
  let windTimer = 0;
  let nextWindChange = rand(2.5, 5.5);

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = width;
    canvas.height = height;

    const count = Math.max(40, Math.floor((width * height) / 900));
    drops.length = 0;
    for (let i = 0; i < count; i += 1) {
      drops.push({
        x: rand(0, width),
        y: rand(0, height),
        vy: rand(24, 60),
        size: Math.random() < 0.2 ? 3 : 2,
        shade: Math.floor(rand(140, 205)),
      });
    }
  }

  function step(ts) {
    if (!step.last) step.last = ts;
    const dt = Math.min(0.04, (ts - step.last) / 1000);
    step.last = ts;

    windTimer += dt;
    if (windTimer > nextWindChange) {
      windTimer = 0;
      nextWindChange = rand(2.5, 6.5);
      targetWind = Math.random() < 0.7 ? rand(8, 22) : rand(-6, 8);
    }
    wind += (targetWind - wind) * Math.min(1, dt * 0.9);

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < drops.length; i += 1) {
      const d = drops[i];
      d.y += d.vy * dt;
      d.x += wind * dt;

      if (d.y > height + 4) {
        d.y = -4;
        d.x = rand(0, width);
      }
      if (d.x > width + 4) d.x = -4;
      if (d.x < -4) d.x = width + 4;

      ctx.fillStyle = `rgb(${d.shade}, ${d.shade}, ${d.shade})`;
      ctx.fillRect(Math.round(d.x), Math.round(d.y), d.size, d.size);
    }

    requestAnimationFrame(step);
  }

  resize();
  requestAnimationFrame(step);
  window.addEventListener("resize", resize);
})();

(function setupTopPattern() {
  const canvas = document.getElementById("top-pattern-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const particles = [];
  const bursts = [];
  let lastSpawn = 0;
  let nextSpawn = 1.6;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pickSpawnPoint(minDist) {
    for (let tries = 0; tries < 30; tries += 1) {
      const cx = rand(width * 0.04, width * 0.96);
      const cy = rand(height * 0.06, height * 0.94);
      let crowded = false;
      for (let i = 0; i < bursts.length; i += 1) {
        const b = bursts[i];
        const progress = b.life > 0 ? b.t / b.life : 1;
        if (progress > 0.45) continue;
        const dx = cx - b.cx;
        const dy = cy - b.cy;
        if ((dx * dx + dy * dy) < (minDist * minDist)) {
          crowded = true;
          break;
        }
      }
      if (!crowded) return { cx, cy };
    }
    return { cx: rand(width * 0.04, width * 0.96), cy: rand(height * 0.06, height * 0.94) };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = width;
    canvas.height = height;
  }

  function spawnSpiral() {
    const { cx, cy } = pickSpawnPoint(Math.max(70, Math.min(width, height) * 0.24));
    const driftAngle = rand(0, Math.PI * 2);
    bursts.push({
      kind: "spiral",
      cx,
      cy,
      t: 0,
      life: rand(7, 11),
      turns: rand(2.2, 3.8),
      growth: rand(8, 14),
      shade: Math.floor(rand(165, 205)),
      vx: Math.cos(driftAngle) * rand(4, 10),
      vy: Math.sin(driftAngle) * rand(4, 10),
      jitter: rand(0.8, 2.4),
      spinDir: Math.random() < 0.5 ? -1 : 1,
      startAngle: rand(0, Math.PI * 2),
    });
  }

  function spawnPulse() {
    const { cx, cy } = pickSpawnPoint(Math.max(70, Math.min(width, height) * 0.24));
    const driftAngle = rand(0, Math.PI * 2);
    bursts.push({
      kind: "pulse",
      cx,
      cy,
      t: 0,
      life: rand(5.5, 9.0),
      shade: Math.floor(rand(150, 200)),
      rMax: rand(Math.max(32, Math.min(width, height) * 0.12), Math.max(70, Math.min(width, height) * 0.26)),
      wobbleFreq: rand(2.2, 4.5),
      wobbleAmp: rand(1.2, 3.0),
      vx: Math.cos(driftAngle) * rand(2, 6),
      vy: Math.sin(driftAngle) * rand(2, 6),
      jitter: rand(0.6, 1.7),
      phase: rand(0, Math.PI * 2),
    });
  }

  function spawnOrbit() {
    const { cx, cy } = pickSpawnPoint(Math.max(70, Math.min(width, height) * 0.24));
    const driftAngle = rand(0, Math.PI * 2);
    const orbitAngle = rand(0, Math.PI * 2);
    bursts.push({
      kind: "orbit",
      cx,
      cy,
      t: 0,
      life: rand(9.0, 14.0),
      shade: Math.floor(rand(90, 130)),
      orbitR: rand(18, 32),
      orbitSpeed: rand(1.1, 2.0) * (Math.random() < 0.5 ? -1 : 1),
      vx: Math.cos(driftAngle) * rand(12, 24),
      vy: Math.sin(driftAngle) * rand(12, 24),
      jitter: rand(0.05, 0.2),
      phase: orbitAngle,
    });
  }

  function spawnStar() {
    const { cx, cy } = pickSpawnPoint(Math.max(75, Math.min(width, height) * 0.27));
    const rays = Math.floor(rand(8, 14));
    const baseAngle = rand(0, Math.PI * 2);
    const rayPoints = [];
    for (let i = 0; i < rays; i += 1) {
      const regular = (Math.PI * 2 * i) / rays;
      const angleJitter = rand(-0.12, 0.12);
      rayPoints.push({
        a: baseAngle + regular + angleJitter,
        s: rand(10, 20),
        delay: rand(0, 0.42),
        phase: rand(0, Math.PI * 2),
        freq: rand(0.08, 0.16),
      });
    }
    const driftAngle = rand(0, Math.PI * 2);
    bursts.push({
      kind: "star",
      cx,
      cy,
      rays: rayPoints,
      t: 0,
      life: rand(5.5, 8.5),
      shade: Math.floor(rand(150, 195)),
      vx: Math.cos(driftAngle) * rand(3, 8),
      vy: Math.sin(driftAngle) * rand(3, 8),
      jitter: rand(0.6, 1.8),
    });
  }

  function spawnStarStraight() {
    const { cx, cy } = pickSpawnPoint(Math.max(75, Math.min(width, height) * 0.27));
    const rays = Math.floor(rand(8, 14));
    const baseAngle = rand(0, Math.PI * 2);
    const rayPoints = [];
    for (let i = 0; i < rays; i += 1) {
      const regular = (Math.PI * 2 * i) / rays;
      const angleJitter = rand(-0.12, 0.12);
      rayPoints.push({ a: baseAngle + regular + angleJitter, s: rand(10, 20), delay: rand(0, 0.42) });
    }
    const driftAngle = rand(0, Math.PI * 2);
    bursts.push({
      kind: "star_straight",
      cx,
      cy,
      rays: rayPoints,
      t: 0,
      life: rand(5.5, 8.5),
      shade: Math.floor(rand(150, 195)),
      vx: Math.cos(driftAngle) * rand(3, 8),
      vy: Math.sin(driftAngle) * rand(3, 8),
      jitter: rand(0.6, 1.8),
    });
  }

  function spawnWave() {
    const { cx, cy } = pickSpawnPoint(Math.max(65, Math.min(width, height) * 0.22));
    const minSep = (16 * Math.PI) / 180;
    const dirs = [];
    let guard = 0;

    while (dirs.length < 3 && guard < 200) {
      guard += 1;
      const candidate = rand(0, Math.PI * 2);
      let ok = true;
      for (let i = 0; i < dirs.length; i += 1) {
        const diff = Math.abs(Math.atan2(Math.sin(candidate - dirs[i]), Math.cos(candidate - dirs[i])));
        if (diff < minSep) {
          ok = false;
          break;
        }
      }
      if (ok) dirs.push(candidate);
    }
    while (dirs.length < 3) dirs.push(rand(0, Math.PI * 2));

    for (let i = 0; i < 3; i += 1) {
      const dir = dirs[i];
      const perp = dir + Math.PI / 2;
      bursts.push({
        kind: "wave",
        cx,
        cy,
        dir,
        perp,
        t: 0,
        life: rand(6.5, 10.5),
        amp: rand(8, 16),
        freq: rand(0.07, 0.12),
        len: rand(80, 150),
        shade: Math.floor(rand(155, 205)),
        vx: Math.cos(dir) * rand(2, 5),
        vy: Math.sin(dir) * rand(2, 5),
        jitter: rand(0.35, 1.1),
        seed: rand(0, Math.PI * 2),
      });
    }
  }

  function emitPixel(x, y, shade, ttl) {
    particles.push({ x, y, shade, ttl });
  }

  function step(ts) {
    if (!step.last) step.last = ts;
    const dt = Math.min(0.05, (ts - step.last) / 1000);
    step.last = ts;

    lastSpawn += dt;
    if (lastSpawn > nextSpawn) {
      lastSpawn = 0;
      nextSpawn = rand(1.6, 4.2);
      const hasOrbit = bursts.some((x) => x.kind === "orbit");
      if (!hasOrbit && Math.random() < 0.45) {
        spawnOrbit();
      } else {
        const spawners = [spawnSpiral, spawnStar, spawnStarStraight, spawnWave, spawnPulse, spawnOrbit];
        const spawn = spawners[Math.floor(Math.random() * spawners.length)];
        spawn();
      }
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = bursts.length - 1; i >= 0; i -= 1) {
      const b = bursts[i];
      b.t += dt;
      const p = Math.min(1, b.t / b.life);
      const tail = Math.max(0, (p - 0.82) / 0.18);
      const wobble = Math.sin(b.t * 6.5 + i) * b.jitter * tail;
      const driftX = b.vx * b.t * tail;
      const driftY = b.vy * b.t * tail;

      if (b.kind === "spiral") {
        const maxTheta = Math.PI * 2 * b.turns * p;
        for (let k = 0; k < 3; k += 1) {
          const localTheta = maxTheta - k * 0.18;
          const theta = b.startAngle + b.spinDir * localTheta;
          const radius = b.growth * localTheta * 0.32;
          const x = b.cx + Math.cos(theta) * radius + driftX + wobble;
          const y = b.cy + Math.sin(theta) * radius + driftY - wobble;
          emitPixel(x, y, b.shade, rand(0.9, 1.8));
        }
      } else if (b.kind === "star") {
        for (let r = 0; r < b.rays.length; r += 1) {
          const ray = b.rays[r];
          const armP = Math.max(0, Math.min(1, (p - ray.delay) / (1 - ray.delay)));
          if (armP <= 0) continue;
          const radius = 4 + armP * Math.max(width, height) * 0.16;
          const radial = radius * (ray.s / 20);
          const dirX = Math.cos(ray.a);
          const dirY = Math.sin(ray.a);
          const nX = Math.cos(ray.a + Math.PI / 2);
          const nY = Math.sin(ray.a + Math.PI / 2);
          const waveAmp = armP * (2.5 + ray.s * 0.18);
          const phase = radial * ray.freq + b.t * 3.0 + ray.phase;
          const waveOffset = Math.sin(phase) * waveAmp;

          const x = b.cx + dirX * radial + nX * waveOffset + driftX + wobble;
          const y = b.cy + dirY * radial + nY * waveOffset + driftY - wobble;
          emitPixel(x, y, b.shade, rand(0.7, 1.35));
        }
      } else if (b.kind === "star_straight") {
        for (let r = 0; r < b.rays.length; r += 1) {
          const ray = b.rays[r];
          const armP = Math.max(0, Math.min(1, (p - ray.delay) / (1 - ray.delay)));
          if (armP <= 0) continue;
          const radius = 4 + armP * Math.max(width, height) * 0.16;
          const radial = radius * (ray.s / 20);
          const x = b.cx + Math.cos(ray.a) * radial + driftX + wobble;
          const y = b.cy + Math.sin(ray.a) * radial + driftY - wobble;
          emitPixel(x, y, b.shade, rand(0.7, 1.35));
        }
      } else if (b.kind === "wave") {
        const length = b.len + p * Math.max(width, height) * 0.22;
        const revealed = Math.max(2, length * p);
        const steps = 14;
        for (let s = 0; s < steps; s += 1) {
          const t = s / (steps - 1);
          const along = t * revealed;
          const phase = along * b.freq + b.t * 2.1;
          const envelope = 1 - t * 0.35;
          const curve = Math.sin(phase) * b.amp * envelope;
          const tailNudge = Math.sin(b.t * 7.4 + s * 1.7 + b.seed) * b.jitter * tail * 0.55;
          const x = b.cx + Math.cos(b.dir) * along + Math.cos(b.perp) * (curve + tailNudge) + driftX;
          const y = b.cy + Math.sin(b.dir) * along + Math.sin(b.perp) * (curve - tailNudge) + driftY;
          emitPixel(x, y, b.shade, rand(0.2, 0.35));
        }
      } else if (b.kind === "pulse") {
        const ringP = Math.min(1, p * 1.1);
        const radius = 4 + ringP * b.rMax;
        const points = 18;
        for (let q = 0; q < points; q += 1) {
          const a = (Math.PI * 2 * q) / points;
          const wave = Math.sin(a * 3 + b.t * b.wobbleFreq + b.phase) * b.wobbleAmp * ringP;
          const x = b.cx + Math.cos(a) * (radius + wave) + driftX + wobble;
          const y = b.cy + Math.sin(a) * (radius + wave) + driftY - wobble;
          emitPixel(x, y, b.shade, rand(0.4, 1.0));
        }
      } else {
        let centerX = b.cx + b.vx * b.t;
        let centerY = b.cy + b.vy * b.t;
        centerX = ((centerX % width) + width) % width;
        centerY = ((centerY % height) + height) % height;

        const orbitA = b.phase + b.orbitSpeed * b.t;
        const radius = b.orbitR + Math.sin(b.t * 4.2) * b.jitter;
        const x = centerX + Math.cos(orbitA) * radius;
        const y = centerY + Math.sin(orbitA) * radius;

        emitPixel(x, y, b.shade, rand(1.3, 2.1));
        emitPixel(x, y, b.shade, rand(0.7, 1.2));
      }

      if (p >= 1) bursts.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const px = particles[i];
      px.ttl -= dt;
      if (px.ttl <= 0) {
        particles.splice(i, 1);
        continue;
      }
      const alpha = Math.min(1, px.ttl / 1.0) * 0.55;
      ctx.fillStyle = `rgba(${px.shade}, ${px.shade}, ${px.shade}, ${alpha})`;
      ctx.fillRect(Math.round(px.x), Math.round(px.y), 3, 3);
    }

    requestAnimationFrame(step);
  }

  resize();
  spawnSpiral();
  spawnStar();
  spawnStarStraight();
  spawnWave();
  spawnPulse();
  spawnOrbit();
  spawnOrbit();
  requestAnimationFrame(step);
  window.addEventListener("resize", resize);
})();
