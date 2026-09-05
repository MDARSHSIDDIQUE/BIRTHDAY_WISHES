/**
 * FAIZU'S BIRTHDAY: LUXURY CELEBRATION SCRIPT
 * - Atmospheric First-Page Surprise Gateway with Touch Unlock
 * - Automated Button-Free Cinematic Cake Ceremony Sequencer
 * - Web Audio Acoustic Chimes & Music Box
 * - Interactive Polaroid Photo Wall & Persistent Guestbook
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. ACOUSTIC MUSIC BOX & CHIMES ENGINE
  // =========================================================================
  class MusicBoxEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.loopTimer = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playChime(freq, dur = 0.8, delay = 0) {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + delay;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Warm acoustic music box envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + dur);
    }

    playMelody() {
      this.init();
      if (this.isPlaying) return;
      this.isPlaying = true;

      const notes = {
        G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
        D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99
      };

      const score = [
        ['G4', 0.4, 0.45], ['G4', 0.25, 0.3], ['A4', 0.55, 0.6], ['G4', 0.55, 0.6], ['C5', 0.55, 0.6], ['B4', 0.9, 1.1],
        ['G4', 0.4, 0.45], ['G4', 0.25, 0.3], ['A4', 0.55, 0.6], ['G4', 0.55, 0.6], ['D5', 0.55, 0.6], ['C5', 0.9, 1.1],
        ['G4', 0.4, 0.45], ['G4', 0.25, 0.3], ['G5', 0.65, 0.7], ['E5', 0.55, 0.6], ['C5', 0.55, 0.6], ['B4', 0.55, 0.6], ['A4', 0.8, 1.0],
        ['F5', 0.4, 0.45], ['F5', 0.25, 0.3], ['E5', 0.55, 0.6], ['C5', 0.55, 0.6], ['D5', 0.65, 0.7], ['C5', 1.2, 1.6]
      ];

      const runLoop = () => {
        if (!this.isPlaying) return;
        let cumulative = 0;
        score.forEach(([n, d, gap]) => {
          this.playChime(notes[n], d, cumulative);
          cumulative += gap;
        });

        this.loopTimer = setTimeout(() => {
          if (this.isPlaying) runLoop();
        }, cumulative * 1000 + 1500);
      };

      runLoop();
    }

    stopMelody() {
      this.isPlaying = false;
      if (this.loopTimer) clearTimeout(this.loopTimer);
    }

    // Soft gentle breeze / candle extinguish sound
    playBlowSound() {
      this.init();
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.45);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    }

    playDing() {
      this.init();
      this.playChime(1046.5, 0.65, 0);
    }

    playMagicHarp() {
      this.init();
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      chord.forEach((freq, idx) => {
        this.playChime(freq, 0.9, idx * 0.08);
      });
    }
  }

  const audio = new MusicBoxEngine();

  // Floating Sound Pill Controls
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      audio.init();
      if (!audio.isPlaying) {
        audio.playMelody();
        musicToggleBtn.classList.add('playing');
        musicLabel.textContent = 'Melody Playing 🎶';
      } else {
        audio.stopMelody();
        musicToggleBtn.classList.remove('playing');
        musicLabel.textContent = 'Play Soft Melody';
      }
    });
  }

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

    // Start background music
    setTimeout(() => {
      audio.playMelody();
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('playing');
        musicLabel.textContent = 'Melody Playing 🎶';
      }
    }, 400);

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
  // 6. POLAROID WALL & LOCALSTORAGE PHOTO UPLOADS
  // =========================================================================
  const realPhotoUpload = document.getElementById('realPhotoUpload');
  const polaroidFrames = document.querySelectorAll('.polaroid-frame');
  const resetPhotosBtn = document.getElementById('resetPhotosBtn');
  let activeFrameIndex = null;

  // Load saved photos from localStorage
  function loadSavedPhotos() {
    try {
      const saved = JSON.parse(localStorage.getItem('faizu_bday_photos_v1') || '{}');
      polaroidFrames.forEach(frame => {
        const idx = frame.getAttribute('data-index');
        const box = frame.querySelector('.polaroid-photo-box');
        const img = frame.querySelector('.real-img');
        if (saved[idx] && img && box) {
          img.src = saved[idx];
          box.classList.add('has-img');
        }
      });
    } catch (e) {
      console.warn('Could not read photos from localStorage', e);
    }
  }
  loadSavedPhotos();

  // Handle Photo upload click
  polaroidFrames.forEach(frame => {
    const editBtn = frame.querySelector('.frame-edit-trigger');
    const photoBox = frame.querySelector('.polaroid-photo-box');

    const triggerUpload = () => {
      activeFrameIndex = frame.getAttribute('data-index');
      if (realPhotoUpload) realPhotoUpload.click();
    };

    if (editBtn) editBtn.addEventListener('click', (e) => { e.stopPropagation(); triggerUpload(); });
    if (photoBox) photoBox.addEventListener('click', triggerUpload);
  });

  if (realPhotoUpload) {
    realPhotoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file || activeFrameIndex === null) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const targetFrame = document.querySelector(`.polaroid-frame[data-index="${activeFrameIndex}"]`);
        if (targetFrame) {
          const img = targetFrame.querySelector('.real-img');
          const box = targetFrame.querySelector('.polaroid-photo-box');
          img.src = dataUrl;
          box.classList.add('has-img');

          try {
            const saved = JSON.parse(localStorage.getItem('faizu_bday_photos_v1') || '{}');
            saved[activeFrameIndex] = dataUrl;
            localStorage.setItem('faizu_bday_photos_v1', JSON.stringify(saved));
          } catch (err) {
            console.warn('LocalStorage full, photo displayed only for session', err);
          }

          audio.playDing();
          triggerWarmConfetti(window.innerWidth * 0.5, window.innerHeight * 0.5, 60);
        }
      };
      reader.readAsDataURL(file);
      realPhotoUpload.value = '';
    });
  }

  if (resetPhotosBtn) {
    resetPhotosBtn.addEventListener('click', () => {
      if (confirm('Reset custom photos back to artwork?')) {
        localStorage.removeItem('faizu_bday_photos_v1');
        polaroidFrames.forEach(frame => {
          const box = frame.querySelector('.polaroid-photo-box');
          const img = frame.querySelector('.real-img');
          if (img) img.src = '';
          if (box) box.classList.remove('has-img');
        });
      }
    });
  }

  // =========================================================================
  // 7. GUESTBOOK / BIRTHDAY WISHES BOARD
  // =========================================================================
  const warmWishForm = document.getElementById('warmWishForm');
  const wishesPinBoard = document.getElementById('wishesPinBoard');
  const wisherName = document.getElementById('wisherName');
  const wisherText = document.getElementById('wisherText');
  const resetWishesBtn = document.getElementById('resetWishesBtn');

  const defaultWishes = [
    {
      name: 'Your Big Brother ❤️',
      text: 'Faizu, you will always have my back, my loyalty, and my love. Never stop dreaming big, little bro!',
      time: 'Just now'
    },
    {
      name: 'Mom & Dad 🤲',
      text: 'May Allah bless you with a long, healthy, and honorable life. We are endlessly proud of you!',
      time: 'Today'
    },
    {
      name: 'The Squad 🍕',
      text: 'Happy Birthday Faizu! Treat is on you this weekend bro, no excuses! Enjoy your day to the fullest!',
      time: 'Today'
    }
  ];

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem('faizu_bday_guestbook_v1');
      return stored ? JSON.parse(stored) : defaultWishes;
    } catch (e) {
      return defaultWishes;
    }
  }

  function renderWishes() {
    if (!wishesPinBoard) return;
    const wishes = getStoredWishes();
    wishesPinBoard.innerHTML = '';

    if (wishes.length === 0) {
      wishesPinBoard.innerHTML = `
        <div class="empty-wishes-msg">
          <span class="empty-icon">💌</span>
          <p>No wishes on the board right now.</p>
          <small>Be the first to post a new wish for Faizu!</small>
        </div>
      `;
      return;
    }

    wishes.forEach((w, index) => {
      const card = document.createElement('div');
      card.className = 'wish-post-card';
      card.innerHTML = `
        <div class="wish-card-header">
          <span class="wish-author">${escapeHTML(w.name)}</span>
          <div class="wish-meta-actions">
            <span class="wish-time">${escapeHTML(w.time)}</span>
            <button class="delete-wish-btn" data-index="${index}" title="Delete Wish" aria-label="Delete Wish">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <p class="wish-message">${escapeHTML(w.text)}</p>
      `;

      const delBtn = card.querySelector('.delete-wish-btn');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteWish(index);
        });
      }

      wishesPinBoard.appendChild(card);
    });
  }

  function deleteWish(index) {
    if (confirm('Are you sure you want to delete this wish note?')) {
      const wishes = getStoredWishes();
      if (index >= 0 && index < wishes.length) {
        wishes.splice(index, 1);
        try {
          localStorage.setItem('faizu_bday_guestbook_v1', JSON.stringify(wishes));
        } catch (err) {
          console.warn('Could not save updated wishes to localStorage', err);
        }
        renderWishes();
      }
    }
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  renderWishes();

  if (resetWishesBtn) {
    resetWishesBtn.addEventListener('click', () => {
      if (confirm('Reset wishes back to default notes?')) {
        localStorage.removeItem('faizu_bday_guestbook_v1');
        renderWishes();
      }
    });
  }

  if (warmWishForm) {
    warmWishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = wisherName.value.trim();
      const textVal = wisherText.value.trim();
      if (!nameVal || !textVal) return;

      const newWish = {
        name: nameVal,
        text: textVal,
        time: 'Just now'
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);

      try {
        localStorage.setItem('faizu_bday_guestbook_v1', JSON.stringify(wishes));
      } catch (err) {
        console.warn('Storage quota exceeded');
      }

      renderWishes();
      wisherName.value = '';
      wisherText.value = '';

      audio.playDing();
      triggerWarmConfetti(window.innerWidth * 0.5, window.innerHeight * 0.6, 90);
    });
  }

  // =========================================================================
  // 8. DYNAMIC 3D CARD PERSPECTIVE TILT PHYSICS
  // =========================================================================
  function initCard3dTilt() {
    const tiltElements = document.querySelectorAll('.gateway-card, .cake-card-wrapper, .polaroid-frame, .vintage-parchment-sheet, .guestbook-form-card');

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

  initCard3dTilt();

});
