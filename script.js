/**
 * FAIZU'S BIRTHDAY: LUXURY CELEBRATION SCRIPT
 * - Atmospheric First-Page Surprise Gateway with Touch Unlock
 * - Automated Cinematic Cake Ceremony Sequencer
 * - Warm Confetti Engine
 * - Interactive 3D Mystery Gift Box & Golden Pass Unboxing
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. MINIMAL SOUND ENGINE (Confetti ding only — no music)
  // =========================================================================
  const audio = {
    _ctx: null,
    _getCtx() {
      if (!this._ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this._ctx = new AudioCtx();
      }
      if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
      return this._ctx;
    },
    playDing() {
      const ctx = this._getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.65);
    },
    playBlowSound() {
      const ctx = this._getCtx();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.45);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    },
    playMagicHarp() {
      const ctx = this._getCtx();
      if (!ctx) return;
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      chord.forEach((freq, idx) => {
        const t = ctx.currentTime + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.9);
      });
    },
    playRibbonUntie() {
      const ctx = this._getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      // High sparkle glide
      [880, 1174.66, 1567.98].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + idx * 0.06 + 0.2);
        gain.gain.setValueAtTime(0, t + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, t + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.35);
      });
    },
    playGiftFanfare() {
      const ctx = this._getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      // Royal ascending triumphant chord
      const fanfareNotes = [440, 554.37, 659.25, 880, 1108.73];
      fanfareNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const noteStart = t + idx * 0.09;
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 1.2);
      });
    }
  };

  // =========================================================================
  // 2. FIRST-PAGE SURPRISE GATEWAY: LIVING CELESTIAL UNIVERSE ENGINE
  // =========================================================================
  const surpriseGateway = document.getElementById('surpriseGateway');
  const gatewayUnlockTrigger = document.getElementById('gatewayUnlockTrigger');
  const pageWrapper = document.getElementById('pageWrapper');
  const starsCanvas = document.getElementById('gatewayStarsCanvas');

  let gatewayAnimationId = null;
  let gatewayUnlocked = false;

  if (starsCanvas && surpriseGateway) {
    const sCtx = starsCanvas.getContext('2d');
    let stardust = [];
    let shootingStars = [];
    let mouseEmbers = [];
    let mouse = { x: -1000, y: -1000, active: false };

    function resizeStars() {
      starsCanvas.width = window.innerWidth;
      starsCanvas.height = window.innerHeight;
      initStardust();
    }

    function initStardust() {
      stardust = [];
      const count = Math.min(85, Math.floor((starsCanvas.width * starsCanvas.height) / 11000));
      for (let i = 0; i < count; i++) {
        stardust.push({
          x: Math.random() * starsCanvas.width,
          y: Math.random() * starsCanvas.height,
          radius: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.75 + 0.25,
          alphaSpeed: Math.random() * 0.015 + 0.005,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(Math.random() * 0.45 + 0.2), // gentle upward float
          swayAngle: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.01,
          color: ['#fae4c3', '#dfb15b', '#ffffff', '#fce9bc', '#d97757'][Math.floor(Math.random() * 5)]
        });
      }
    }

    resizeStars();
    window.addEventListener('resize', resizeStars);

    // Interactive mouse / touch movement tracking
    function onPointerMove(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.x = clientX;
      mouse.y = clientY;
      mouse.active = true;

      // Spawn magical cursor embers
      for (let i = 0; i < 2; i++) {
        mouseEmbers.push({
          x: clientX + (Math.random() - 0.5) * 12,
          y: clientY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.8,
          radius: Math.random() * 2.5 + 1.2,
          alpha: 1,
          decay: Math.random() * 0.035 + 0.025,
          color: ['#dfb15b', '#fae4c3', '#ffffff'][Math.floor(Math.random() * 3)]
        });
      }
    }

    surpriseGateway.addEventListener('mousemove', onPointerMove);
    surpriseGateway.addEventListener('touchmove', onPointerMove, { passive: true });
    surpriseGateway.addEventListener('mouseleave', () => { mouse.active = false; });

    // Periodic Shooting Star Spawner
    function spawnShootingStar() {
      if (gatewayUnlocked) return;
      shootingStars.push({
        x: Math.random() * (starsCanvas.width * 0.7),
        y: Math.random() * (starsCanvas.height * 0.35),
        length: Math.random() * 80 + 70,
        speed: Math.random() * 8 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25, // ~45 deg diagonal
        alpha: 1,
        width: Math.random() * 1.6 + 1.2
      });
      // Schedule next comet
      setTimeout(spawnShootingStar, Math.random() * 3000 + 2500);
    }
    setTimeout(spawnShootingStar, 1800);

    function renderGatewayUniverse() {
      if (gatewayUnlocked && surpriseGateway.style.display === 'none') {
        if (gatewayAnimationId) cancelAnimationFrame(gatewayAnimationId);
        return;
      }

      sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

      // 1. Render & Update Stardust Particles
      for (let i = 0; i < stardust.length; i++) {
        const p = stardust[i];

        // Wave sway & upward float
        p.swayAngle += p.swaySpeed;
        p.x += p.vx + Math.sin(p.swayAngle) * 0.35;
        p.y += p.vy;

        // Twinkle
        p.alpha += p.alphaSpeed;
        if (p.alpha >= 1 || p.alpha <= 0.2) p.alphaSpeed = -p.alphaSpeed;

        // Interactive physics with cursor
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110 && dist > 0) {
            const force = (110 - dist) / 110;
            p.x += (dx / dist) * force * 2.5;
            p.y += (dy / dist) * force * 2.5;
          }
        }

        // Screen wrap
        if (p.y < -10) p.y = starsCanvas.height + 10;
        if (p.x < -10) p.x = starsCanvas.width + 10;
        if (p.x > starsCanvas.width + 10) p.x = -10;

        // Draw particle with soft glowing halo
        sCtx.beginPath();
        sCtx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(223, 177, 91, ${Math.max(0, p.alpha * 0.22)})`;
        sCtx.fill();

        sCtx.beginPath();
        sCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        sCtx.fillStyle = p.color;
        sCtx.globalAlpha = Math.max(0, p.alpha);
        sCtx.fill();
        sCtx.globalAlpha = 1;

        // Draw Constellation Lines to nearby neighbors
        for (let j = i + 1; j < stardust.length; j++) {
          const p2 = stardust[j];
          const distSq = (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2;
          if (distSq < 6400) { // 80px distance
            const lineAlpha = (1 - Math.sqrt(distSq) / 80) * 0.18;
            sCtx.beginPath();
            sCtx.moveTo(p.x, p.y);
            sCtx.lineTo(p2.x, p2.y);
            sCtx.strokeStyle = `rgba(223, 177, 91, ${lineAlpha})`;
            sCtx.lineWidth = 0.8;
            sCtx.stroke();
          }
        }
      }

      // 2. Render Interactive Cursor Embers
      for (let i = mouseEmbers.length - 1; i >= 0; i--) {
        const e = mouseEmbers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.alpha -= e.decay;
        if (e.alpha <= 0) {
          mouseEmbers.splice(i, 1);
          continue;
        }
        sCtx.beginPath();
        sCtx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        sCtx.fillStyle = e.color;
        sCtx.globalAlpha = e.alpha;
        sCtx.shadowColor = e.color;
        sCtx.shadowBlur = 6;
        sCtx.fill();
        sCtx.shadowBlur = 0;
        sCtx.globalAlpha = 1;
      }

      // 3. Render Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = sCtx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
        grad.addColorStop(0.3, `rgba(223, 177, 91, ${s.alpha * 0.8})`);
        grad.addColorStop(1, `rgba(223, 177, 91, 0)`);

        sCtx.beginPath();
        sCtx.moveTo(s.x, s.y);
        sCtx.lineTo(tailX, tailY);
        sCtx.strokeStyle = grad;
        sCtx.lineWidth = s.width;
        sCtx.lineCap = 'round';
        sCtx.stroke();

        // Advance comet
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.022;

        if (s.alpha <= 0 || s.x > starsCanvas.width + 100 || s.y > starsCanvas.height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      gatewayAnimationId = requestAnimationFrame(renderGatewayUniverse);
    }
    renderGatewayUniverse();
  }

  // Gateway Unlock Trigger (ONLY on dedicated button click)
  const gatewayUnlockBtn = document.getElementById('gatewayUnlockBtn');

  function unlockBirthdaySurprise() {
    if (gatewayUnlocked) return;
    gatewayUnlocked = true;

    // Play magical harp chime
    audio.playMagicHarp();

    // Gateway exit animation
    if (surpriseGateway) {
      surpriseGateway.classList.add('unlocked');
      setTimeout(() => {
        surpriseGateway.style.display = 'none';
      }, 1100);
    }

    // Reveal main page
    if (pageWrapper) {
      pageWrapper.classList.add('revealed');
    }

    // Celebration Confetti burst
    setTimeout(() => {
      triggerWarmConfetti(window.innerWidth * 0.5, window.innerHeight * 0.45, 140);
    }, 300);
  }

  if (gatewayUnlockBtn) {
    gatewayUnlockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unlockBirthdaySurprise();
    });
    gatewayUnlockBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        unlockBirthdaySurprise();
      }
    });
  }

  // =========================================================================
  // 3. ROYAL DIAMOND GOLD DUST & SHIMMER ATMOSPHERE
  // =========================================================================
  const bokehCanvas = document.getElementById('bokehCanvas');
  const bCtx = bokehCanvas ? bokehCanvas.getContext('2d') : null;
  let bokehParticles = [];

  function resizeBokeh() {
    if (!bokehCanvas) return;
    bokehCanvas.width = window.innerWidth;
    bokehCanvas.height = window.innerHeight;
    bokehParticles = [];

    // 1. Large Ambient Floating Luxury Orbs
    for (let i = 0; i < 16; i++) {
      bokehParticles.push({
        type: 'orb',
        x: Math.random() * bokehCanvas.width,
        y: Math.random() * bokehCanvas.height,
        radius: Math.random() * 80 + 40,
        color: ['rgba(212, 175, 55, 0.06)', 'rgba(252, 246, 186, 0.04)', 'rgba(168, 85, 247, 0.03)'][Math.floor(Math.random() * 3)],
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    // 2. Fine Shimmering Diamond Gold Dust Particles
    for (let i = 0; i < 45; i++) {
      bokehParticles.push({
        type: 'dust',
        x: Math.random() * bokehCanvas.width,
        y: Math.random() * bokehCanvas.height,
        radius: Math.random() * 2 + 0.8,
        color: ['#fff2b8', '#d4af37', '#ffffff', '#e09f58'][Math.floor(Math.random() * 4)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.2),
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.008
      });
    }
  }

  if (bokehCanvas) {
    resizeBokeh();
    window.addEventListener('resize', resizeBokeh);

    function renderBokeh() {
      bCtx.clearRect(0, 0, bokehCanvas.width, bokehCanvas.height);
      bokehParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'dust') {
          p.alpha += p.twinkleSpeed;
          if (p.alpha >= 0.95 || p.alpha <= 0.15) p.twinkleSpeed = -p.twinkleSpeed;
        }

        if (p.x < -p.radius) p.x = bokehCanvas.width + p.radius;
        if (p.x > bokehCanvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = bokehCanvas.height + p.radius;
        if (p.y > bokehCanvas.height + p.radius) p.y = -p.radius;

        bCtx.save();
        bCtx.beginPath();
        bCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.type === 'dust') {
          bCtx.shadowColor = p.color;
          bCtx.shadowBlur = 8;
          bCtx.fillStyle = p.color;
          bCtx.globalAlpha = Math.max(0, p.alpha);
        } else {
          bCtx.fillStyle = p.color;
          bCtx.globalAlpha = p.alpha;
        }

        bCtx.fill();
        bCtx.restore();
      });
      requestAnimationFrame(renderBokeh);
    }
    renderBokeh();
  }

  // Confetti Engine
  const confCanvas = document.getElementById('confettiCanvas');
  const cCtx = confCanvas ? confCanvas.getContext('2d') : null;
  let confettiPieces = [];

  function resizeConf() {
    if (!confCanvas) return;
    confCanvas.width = window.innerWidth;
    confCanvas.height = window.innerHeight;
  }
  if (confCanvas) {
    resizeConf();
    window.addEventListener('resize', resizeConf);
  }

  function triggerWarmConfetti(x = window.innerWidth / 2, y = window.innerHeight * 0.5, count = 100) {
    if (!confCanvas) return;
    const palette = ['#dfb15b', '#fae4c3', '#d97757', '#ffffff', '#f5ebd7', '#f43f5e'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      confettiPieces.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: Math.random() * 8 + 4,
        color: palette[Math.floor(Math.random() * palette.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        alpha: 1,
        gravity: 0.14
      });
    }
  }

  if (confCanvas) {
    function renderConfetti() {
      cCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.008;

        if (p.alpha <= 0 || p.y > confCanvas.height) {
          confettiPieces.splice(i, 1);
          continue;
        }

        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate((p.rotation * Math.PI) / 180);
        cCtx.globalAlpha = Math.max(0, p.alpha);
        cCtx.fillStyle = p.color;
        cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        cCtx.restore();
      }
      requestAnimationFrame(renderConfetti);
    }
    renderConfetti();
  }

  // Confetti Replay in footer
  const confettiReplayBtn = document.getElementById('confettiReplayBtn');
  if (confettiReplayBtn) {
    confettiReplayBtn.addEventListener('click', () => {
      audio.playDing();
      triggerWarmConfetti(window.innerWidth * 0.5, window.innerHeight * 0.7, 120);
    });
  }

  // =========================================================================
  // 4. INTERACTIVE TOUCHABLE CAKE CEREMONY (TOUCH TO BLOW & CUT)
  // =========================================================================
  const cakeSection = document.getElementById('cakeSection');
  const cakeCardWrapper = document.getElementById('cakeCardWrapper');
  const cakeStatusRibbon = document.getElementById('cakeStatusRibbon');
  const cake3dModel = document.getElementById('cake3dModel');
  const candlesAssembly = document.getElementById('candlesAssembly');
  const candles = document.querySelectorAll('.candle-unit-3d');
  const chefKnife = document.getElementById('knifeIconCut');
  const slicePopup = document.getElementById('slicePlatePopup');
  const replayCakeBtn = document.getElementById('replayCakeBtn');
  const cakeSparklerCanvas = document.getElementById('cakeSparklerCanvas');

  let sparklerActive = false;
  let sparklerParticles = [];

  // Cake Sparkler Particle Canvas
  if (cakeSparklerCanvas) {
    const spCtx = cakeSparklerCanvas.getContext('2d');

    function resizeCakeCanvas() {
      cakeSparklerCanvas.width  = cakeSparklerCanvas.offsetWidth;
      cakeSparklerCanvas.height = cakeSparklerCanvas.offsetHeight;
    }
    resizeCakeCanvas();
    window.addEventListener('resize', resizeCakeCanvas);

    function spawnSparklerParticle() {
      const cx = cakeSparklerCanvas.width  * 0.5;
      const cy = cakeSparklerCanvas.height * 0.25; // at candle flame level
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 4.5 + 1.5;
      const colors = ['#fde047', '#f97316', '#fae4c3', '#dfb15b', '#ffffff', '#fb7185'];
      sparklerParticles.push({
        x: cx + (Math.random() - 0.5) * 50,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.8,
        size: Math.random() * 3.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.035 + 0.025
      });
    }

    function renderSparkler() {
      spCtx.clearRect(0, 0, cakeSparklerCanvas.width, cakeSparklerCanvas.height);
      if (sparklerActive) {
        for (let i = 0; i < 5; i++) spawnSparklerParticle();
      }
      for (let i = sparklerParticles.length - 1; i >= 0; i--) {
        const p = sparklerParticles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.12; // gravity
        p.vx *= 0.97;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          sparklerParticles.splice(i, 1);
          continue;
        }
        spCtx.save();
        spCtx.globalAlpha = p.alpha;
        spCtx.fillStyle = p.color;
        spCtx.shadowColor = p.color;
        spCtx.shadowBlur = 8;
        spCtx.beginPath();
        spCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        spCtx.fill();
        spCtx.restore();
      }
      requestAnimationFrame(renderSparkler);
    }
    renderSparkler();
  }

  // Cake State: 'lit' -> 'blown' -> 'cut'
  let cakeStage = 'lit';

  // 1. Touch candles to blow out & make a wish
  function blowCandlesByTouch() {
    if (cakeStage !== 'lit') return;
    cakeStage = 'blown';

    // Play blow sound
    audio.playBlowSound();

    // Extinguish candles with smoke puff
    candles.forEach(c => {
      c.classList.add('blown');
    });

    // Fire celebratory sparkler fountain from the candle zone
    sparklerActive = true;
    audio.playDing();

    // Confetti burst
    triggerWarmConfetti(window.innerWidth * 0.5, window.innerHeight * 0.5, 60);

    // Update ribbon to invite knife cut
    cakeStatusRibbon.classList.remove('done');
    cakeStatusRibbon.classList.add('highlight');
    cakeStatusRibbon.textContent = '✨ Wish made! Now tap the cake to cut your slice! 🔪';

    // Mark cake as ready to cut
    if (cake3dModel) {
      cake3dModel.classList.add('ready-to-cut');
    }

    // Auto-stop sparklers after 3.5 seconds
    setTimeout(() => {
      sparklerActive = false;
    }, 3500);
  }

  // Bind touch / click to candles & candle rack
  candles.forEach(candle => {
    candle.addEventListener('click', (e) => {
      e.stopPropagation();
      blowCandlesByTouch();
    });
  });

  if (candlesAssembly) {
    candlesAssembly.addEventListener('click', (e) => {
      e.stopPropagation();
      blowCandlesByTouch();
    });
  }

  // 2. Touch cake / knife to slice
  function cutCakeByTouch() {
    if (cakeStage !== 'blown') return;
    cakeStage = 'cut';

    if (cake3dModel) {
      cake3dModel.classList.remove('ready-to-cut');
      cake3dModel.classList.add('is-cut');
    }

    // Animate chef knife cut
    if (chefKnife) {
      chefKnife.classList.remove('cutting');
      void chefKnife.offsetWidth;
      chefKnife.classList.add('cutting');
    }
    audio.playDing();
    cakeStatusRibbon.textContent = '🔪 Slicing the celebration cake...';

    // Present celebration sparklers & confetti
    setTimeout(() => {
      cakeStatusRibbon.classList.remove('highlight');
      cakeStatusRibbon.classList.add('done');
      cakeStatusRibbon.textContent = "🍰 Cake is sliced! Happy Birthday Faizu! ❤️";

      audio.playDing();
      triggerWarmConfetti(window.innerWidth * 0.5, window.innerHeight * 0.45, 160);

      // Show replay button
      if (replayCakeBtn) {
        replayCakeBtn.style.display = 'inline-flex';
      }
    }, 900);
  }

  // Bind touch / click to cake model & knife
  if (cake3dModel) {
    cake3dModel.addEventListener('click', () => {
      if (cakeStage === 'lit') {
        // If user tapped cake before blowing candles, blow them first!
        blowCandlesByTouch();
      } else if (cakeStage === 'blown') {
        cutCakeByTouch();
      }
    });
  }

  if (chefKnife) {
    chefKnife.addEventListener('click', (e) => {
      e.stopPropagation();
      cutCakeByTouch();
    });
  }

  // 3. Replay / Relight Button Listener
  if (replayCakeBtn) {
    replayCakeBtn.addEventListener('click', () => {
      cakeStage = 'lit';

      // Relight candles
      candles.forEach(c => {
        c.classList.remove('blown');
        c.classList.remove('wind-flutter');
      });

      // Reset knife & cake cut seam
      if (chefKnife) chefKnife.classList.remove('cutting');
      if (cake3dModel) cake3dModel.classList.remove('is-cut');

      // Reset status ribbon
      cakeStatusRibbon.classList.remove('done');
      cakeStatusRibbon.classList.add('highlight');
      cakeStatusRibbon.textContent = '🕯️ Candles relit! Touch them to blow out & make another wish!';

      replayCakeBtn.style.display = 'none';
      audio.playDing();
    });
  }

  // =========================================================================
  // 5. SMOOTH SCROLL REVEAL OBSERVER
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => scrollObserver.observe(el));
  }

  // =========================================================================
  // 6. 3D INTERACTIVE MYSTERY GIFT BOX & GOLDEN PASS UNBOXING SEQUENCER
  // =========================================================================
  const giftStageWrapper = document.getElementById('giftStageWrapper');
  const giftBox3d = document.getElementById('giftBox3d');
  const goldenBowAssembly = document.getElementById('goldenBowAssembly');
  const giftStatusRibbon = document.getElementById('giftStatusRibbon');
  const giftLightBurst = document.getElementById('giftLightBurst');
  const goldenVoucherReveal = document.getElementById('goldenVoucherReveal');
  const reboxGiftBtn = document.getElementById('reboxGiftBtn');
  const claimPassBtn = document.getElementById('claimPassBtn');
  const giftSparkleCanvas = document.getElementById('giftSparkleCanvas');

  let giftState = 'wrapped'; // 'wrapped' -> 'untied' -> 'opened'
  let giftParticles = [];
  let burstActive = false;

  // Gift Sparkle Canvas
  if (giftSparkleCanvas) {
    const gCtx = giftSparkleCanvas.getContext('2d');

    function resizeGiftCanvas() {
      giftSparkleCanvas.width = giftSparkleCanvas.offsetWidth || 800;
      giftSparkleCanvas.height = giftSparkleCanvas.offsetHeight || 520;
    }
    resizeGiftCanvas();
    window.addEventListener('resize', resizeGiftCanvas);

    function spawnGiftSparkle(burst = false) {
      const w = giftSparkleCanvas.width;
      const h = giftSparkleCanvas.height;
      const cx = w * 0.5;
      const cy = h * 0.45;

      if (burst) {
        for (let i = 0; i < 35; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 2;
          giftParticles.push({
            x: cx + (Math.random() - 0.5) * 40,
            y: cy + (Math.random() - 0.5) * 40,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.8,
            size: Math.random() * 3.5 + 1.5,
            color: ['#ffffff', '#dfb15b', '#fae4c3', '#fb7185', '#fde047'][Math.floor(Math.random() * 5)],
            alpha: 1,
            decay: Math.random() * 0.025 + 0.015
          });
        }
      } else if (giftParticles.length < 24) {
        giftParticles.push({
          x: cx + (Math.random() - 0.5) * 220,
          y: cy + (Math.random() - 0.5) * 160 + 30,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -(Math.random() * 0.8 + 0.3),
          size: Math.random() * 2.2 + 0.8,
          color: ['#fae4c3', '#dfb15b', '#ffffff', '#ffd166'][Math.floor(Math.random() * 4)],
          alpha: Math.random() * 0.8 + 0.2,
          decay: Math.random() * 0.012 + 0.006
        });
      }
    }

    function renderGiftSparkles() {
      gCtx.clearRect(0, 0, giftSparkleCanvas.width, giftSparkleCanvas.height);
      if (giftState !== 'opened' || burstActive) {
        spawnGiftSparkle(burstActive);
        burstActive = false;
      }
      for (let i = giftParticles.length - 1; i >= 0; i--) {
        const p = giftParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          giftParticles.splice(i, 1);
          continue;
        }
        gCtx.save();
        gCtx.globalAlpha = p.alpha;
        gCtx.fillStyle = p.color;
        gCtx.shadowColor = p.color;
        gCtx.shadowBlur = 6;
        gCtx.beginPath();
        gCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        gCtx.fill();
        gCtx.restore();
      }
      requestAnimationFrame(renderGiftSparkles);
    }
    renderGiftSparkles();
  }

  // Interactive Unbox Trigger
  function handleGiftInteraction() {
    if (!giftBox3d) return;

    if (giftState === 'wrapped') {
      // Step 1: Untie ribbon
      giftState = 'untied';
      audio.playRibbonUntie();
      giftBox3d.classList.add('ribbon-untied');
      burstActive = true;

      if (giftStatusRibbon) {
        giftStatusRibbon.classList.add('highlight');
        giftStatusRibbon.innerHTML = `
          <span class="gift-status-icon">🔓</span>
          <span class="gift-status-text">Ribbon untied! Now tap the box or lid to open your surprise!</span>
        `;
      }
    } else if (giftState === 'untied') {
      // Step 2: Open lid & reveal pass
      giftState = 'opened';
      audio.playGiftFanfare();
      giftBox3d.classList.add('box-opened');
      if (giftLightBurst) giftLightBurst.classList.add('active');
      burstActive = true;

      // Confetti burst from box position
      const rect = giftBox3d.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      triggerWarmConfetti(centerX, centerY, 130);

      // Reveal floating golden pass voucher
      setTimeout(() => {
        if (giftStageWrapper) giftStageWrapper.classList.add('is-unboxed');
        giftBox3d.classList.add('voucher-expanded');
        if (goldenVoucherReveal) goldenVoucherReveal.classList.add('revealed');
        if (giftStatusRibbon) {
          giftStatusRibbon.classList.remove('highlight');
          giftStatusRibbon.classList.add('unlocked');
          giftStatusRibbon.innerHTML = `
            <span class="gift-status-icon">🎉</span>
            <span class="gift-status-text">Surprise Unboxed! Your Brotherhood Golden Pass is active!</span>
          `;
        }
      }, 420);
    }
  }

  if (giftBox3d) {
    giftBox3d.addEventListener('click', handleGiftInteraction);
    giftBox3d.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleGiftInteraction();
      }
    });
  }

  if (goldenBowAssembly) {
    goldenBowAssembly.addEventListener('click', (e) => {
      e.stopPropagation();
      handleGiftInteraction();
    });
  }

  // Re-box & replay surprise
  if (reboxGiftBtn) {
    reboxGiftBtn.addEventListener('click', () => {
      audio.playDing();
      if (goldenVoucherReveal) goldenVoucherReveal.classList.remove('revealed');
      if (giftBox3d) giftBox3d.classList.remove('voucher-expanded');
      if (giftLightBurst) giftLightBurst.classList.remove('active');
      if (giftStageWrapper) giftStageWrapper.classList.remove('is-unboxed');

      setTimeout(() => {
        if (giftBox3d) {
          giftBox3d.classList.remove('box-opened');
          giftBox3d.classList.remove('ribbon-untied');
        }
        if (giftStatusRibbon) {
          giftStatusRibbon.classList.remove('unlocked', 'highlight');
          giftStatusRibbon.innerHTML = `
            <span class="gift-status-icon">🎀</span>
            <span class="gift-status-text">Tap the golden bow or gift box to untie the ribbon!</span>
          `;
        }
        giftState = 'wrapped';
      }, 350);
    });
  }

  // Claim Pass celebration
  if (claimPassBtn) {
    claimPassBtn.addEventListener('click', () => {
      audio.playDing();
      triggerWarmConfetti(window.innerWidth * 0.5, window.innerHeight * 0.5, 100);
      claimPassBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> Pass Activated for Life! ❤️';
      claimPassBtn.style.pointerEvents = 'none';
      setTimeout(() => {
        claimPassBtn.style.pointerEvents = 'auto';
      }, 2000);
    });
  }

  // =========================================================================
  // 7. DYNAMIC 3D CARD PERSPECTIVE TILT PHYSICS
  // =========================================================================
  function initCard3dTilt() {
    const tiltElements = document.querySelectorAll('.gateway-card, .cake-card-wrapper, .polaroid-frame, .vintage-parchment-sheet, .voucher-card');

    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // =========================================================================
  // 9. POLAROID LIGHTBOX EXPANDER
  // =========================================================================
  function initPolaroidLightbox() {
    const lightbox = document.getElementById('polaroidLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxSub = document.getElementById('lightboxSub');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const backdrop = document.getElementById('lightboxBackdrop');
    const polaroidFrames = document.querySelectorAll('.polaroid-frame');

    if (!lightbox || !lightboxImg) return;

    function openLightbox(frame) {
      const img = frame.querySelector('.real-img');
      const caption = frame.querySelector('.handwritten-caption');
      const sub = frame.querySelector('.polaroid-bottom small');

      if (!img || !img.getAttribute('src')) return;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Polaroid Memory';
      if (lightboxTitle) lightboxTitle.textContent = caption ? caption.textContent : 'Precious Memory';
      if (lightboxSub) lightboxSub.textContent = sub ? sub.textContent : '';

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      audio.playDing();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    polaroidFrames.forEach(frame => {
      frame.addEventListener('click', () => {
        openLightbox(frame);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  initCard3dTilt();
  initPolaroidLightbox();

});

/* ==========================================================================
   PREMIUM LUXURY AMBIENCE - ENHANCED BACKGROUND & ANIMATION DRIVER
   Pure additive module. Builds the starfield, cursor spotlight and the
   rising love particles. Does not touch any existing component.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // -----------------------------------------------------------------------
  // A. Twinkling luxury starfield
  // -----------------------------------------------------------------------
  const starfield = document.getElementById('luxStarfield');
  if (starfield && !reduceMotion) {
    const starCount = Math.min(80, Math.floor(window.innerWidth / 16));

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('span');
      star.className = 'lux-star';
      const size = (Math.random() * 2 + 1).toFixed(2);
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.top = (Math.random() * 100).toFixed(2) + '%';
      star.style.left = (Math.random() * 100).toFixed(2) + '%';
      star.style.setProperty('--dur', (Math.random() * 3.5 + 2.2).toFixed(2) + 's');
      star.style.setProperty('--delay', (Math.random() * 6).toFixed(2) + 's');
      starfield.appendChild(star);
    }
  }

  // -----------------------------------------------------------------------
  // B. Golden cursor spotlight
  // -----------------------------------------------------------------------
  const cursorGlow = document.getElementById('luxCursorGlow');
  if (cursorGlow && finePointer && !reduceMotion) {
    let rafId = null;

    const moveGlow = (x, y) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        cursorGlow.style.setProperty('--cx', x + 'px');
        cursorGlow.style.setProperty('--cy', y + 'px');
        rafId = null;
      });
    };

    window.addEventListener('pointermove', (e) => {
      cursorGlow.classList.add('is-active');
      moveGlow(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('pointerout', () => cursorGlow.classList.remove('is-active'));
  }

  // -----------------------------------------------------------------------
  // C. Rising love particles (hearts, sparkles, stars, balloons)
  // -----------------------------------------------------------------------
  const floatLayer = document.getElementById('luxFloatingParticles');
  if (floatLayer && !reduceMotion) {
    const emojis = ['\u2764\uFE0F', '\uD83D\uDC9B', '\u2728', '\u2B50', '\uD83C\uDF88', '\uD83D\uDCAB', '\uD83D\uDDA4'];
    const maxParticles = 26;
    let spawnTimer = null;

    const spawnParticle = () => {
      if (floatLayer.querySelectorAll('.lux-floatly').length >= maxParticles) return;

      const p = document.createElement('span');
      p.className = 'lux-floatly';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const size = Math.random() * 16 + 12;
      const duration = Math.random() * 9 + 8;

      p.style.left = (Math.random() * 100).toFixed(2) + '%';
      p.style.fontSize = size.toFixed(1) + 'px';
      p.style.setProperty('--dur', duration.toFixed(1) + 's');
      p.style.setProperty('--drift', (Math.random() * 140 - 70).toFixed(1) + 'px');
      p.style.setProperty('--spin', (Math.random() * 240 + 90).toFixed(0) + 'deg');
      p.style.setProperty('--start-scale', (Math.random() * 0.4 + 0.5).toFixed(2));
      p.style.setProperty('--end-scale', (Math.random() * 0.6 + 1).toFixed(2));
      p.style.setProperty('--peak-opacity', (Math.random() * 0.3 + 0.3).toFixed(2));

      p.addEventListener('animationend', () => p.remove());
      floatLayer.appendChild(p);
    };

    const startSpawning = () => {
      if (spawnTimer) return;
      spawnTimer = setInterval(spawnParticle, 850);
    };

    // Pause when the site is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && spawnTimer) {
        clearInterval(spawnTimer);
        spawnTimer = null;
      } else if (!document.hidden) {
        startSpawning();
      }
    });

    startSpawning();
  }

  // -----------------------------------------------------------------------
  // D. Gentle scroll parallax on the starfield
  // -----------------------------------------------------------------------
  if (starfield && finePointer && !reduceMotion) {
    let scrollRaf = null;

    window.addEventListener('scroll', () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        starfield.style.transform = 'translate3d(0, ' + (window.scrollY * -0.04).toFixed(1) + 'px, 0)';
        scrollRaf = null;
      });
    }, { passive: true });
  }

});
