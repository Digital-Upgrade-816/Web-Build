/* ============================================
   FAST TRACK WEBSITES — Digital Upgrade
   JavaScript: Parallax, Algorithmic Art, Animations
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     PARALLAX SCROLLING — Hero Background
  ------------------------------------------ */
  const heroWrapper = document.getElementById('ftw_hero-wrapper');
  const heroBgImg = heroWrapper ? heroWrapper.querySelector('#ftw_hero-bg img') : null;

  function updateParallax() {
    if (!heroBgImg) return;
    const scrollY = window.scrollY;
    const wrapperH = heroWrapper.offsetHeight;
    if (scrollY <= wrapperH) {
      heroBgImg.style.transform = 'translate3d(0,' + (scrollY * 0.35) + 'px,0)';
    }
  }

  /* ------------------------------------------
     ALGORITHMIC ART — Generative Canvas
     Creates flowing particle networks
  ------------------------------------------ */
  class AlgorithmicArt {
    constructor(canvasId, opts = {}) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.connections = [];
      this.mouse = { x: -1000, y: -1000 };
      this.opts = {
        particleCount: opts.particleCount || 60,
        particleColor: opts.particleColor || 'rgba(232,168,56,',
        lineColor: opts.lineColor || 'rgba(232,168,56,',
        secondaryColor: opts.secondaryColor || 'rgba(12,76,145,',
        maxDist: opts.maxDist || 150,
        speed: opts.speed || 0.4,
        shapes: opts.shapes !== false,
        ...opts
      };
      this.animId = null;
      this.init();
    }

    init() {
      this.resize();
      this.createParticles();
      this.animate();

      const ro = new ResizeObserver(() => this.resize());
      ro.observe(this.canvas.parentElement);

      this.canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.parentElement.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });
    }

    resize() {
      const parent = this.canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = parent.offsetWidth * dpr;
      this.canvas.height = parent.offsetHeight * dpr;
      this.canvas.style.width = parent.offsetWidth + 'px';
      this.canvas.style.height = parent.offsetHeight + 'px';
      this.ctx.scale(dpr, dpr);
      this.w = parent.offsetWidth;
      this.h = parent.offsetHeight;
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.opts.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * this.opts.speed,
          vy: (Math.random() - 0.5) * this.opts.speed,
          r: Math.random() * 2.5 + 1,
          type: Math.random() > 0.7 ? 'accent' : 'primary'
        });
      }
    }

    drawShapes() {
      if (!this.opts.shapes) return;
      const ctx = this.ctx;
      const t = Date.now() * 0.001;

      // Rotating hexagons
      ctx.save();
      ctx.translate(this.w * 0.8, this.h * 0.3);
      ctx.rotate(t * 0.2);
      ctx.strokeStyle = this.opts.particleColor + '0.08)';
      ctx.lineWidth = 1;
      this.drawPolygon(ctx, 0, 0, 80, 6);
      ctx.restore();

      ctx.save();
      ctx.translate(this.w * 0.15, this.h * 0.7);
      ctx.rotate(-t * 0.15);
      ctx.strokeStyle = this.opts.secondaryColor + '0.06)';
      ctx.lineWidth = 1;
      this.drawPolygon(ctx, 0, 0, 60, 6);
      ctx.restore();

      // Floating triangles
      ctx.save();
      ctx.translate(this.w * 0.6, this.h * 0.8);
      ctx.rotate(t * 0.3);
      ctx.strokeStyle = this.opts.particleColor + '0.06)';
      ctx.lineWidth = 1;
      this.drawPolygon(ctx, 0, 0, 40, 3);
      ctx.restore();

      // Concentric circles
      ctx.save();
      ctx.strokeStyle = this.opts.secondaryColor + '0.04)';
      ctx.lineWidth = 0.5;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(this.w * 0.9, this.h * 0.6, 30 * i + Math.sin(t + i) * 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawPolygon(ctx, cx, cy, r, sides) {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    animate() {
      this.ctx.clearRect(0, 0, this.w, this.h);

      this.drawShapes();

      // Update and draw particles
      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;

        // Mouse interaction
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        const color = p.type === 'accent' ? this.opts.particleColor : this.opts.secondaryColor;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = color + '0.6)';
        this.ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.opts.maxDist) {
            const alpha = (1 - dist / this.opts.maxDist) * 0.25;
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = this.opts.lineColor + alpha + ')';
            this.ctx.lineWidth = 0.8;
            this.ctx.stroke();
          }
        }
      }

      this.animId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.animId) cancelAnimationFrame(this.animId);
    }
  }


  /* ------------------------------------------
     SCROLL REVEAL ANIMATION
  ------------------------------------------ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.ftw_reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ftw_visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }


  /* ------------------------------------------
     COUNTER ANIMATION
  ------------------------------------------ */
  function animateCounters() {
    const counters = document.querySelectorAll('.ftw_stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const isNumber = /^\d+$/.test(text);

          if (isNumber) {
            const target = parseInt(text, 10);
            let current = 0;
            const duration = 1500;
            const start = performance.now();

            function step(now) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              current = Math.round(target * eased);
              el.textContent = current;
              if (progress < 1) requestAnimationFrame(step);
            }
            el.textContent = '0';
            requestAnimationFrame(step);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }


  /* ------------------------------------------
     FLOATING SHAPES PARALLAX (hero)
  ------------------------------------------ */
  function updateHeroShapes() {
    const shapes = document.querySelectorAll('.ftw_hero-shape');
    const scrollY = window.scrollY;
    shapes.forEach((shape, i) => {
      const speed = 0.05 + i * 0.02;
      shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
  }


  /* ------------------------------------------
     GALLERY AUTO-SCROLL — Ensure seamless loop
  ------------------------------------------ */
  function initGalleryLoop() {
    const track = document.getElementById('ftw_gallery-track');
    if (!track) return;

    // The CSS animation handles the seamless loop since we duplicated the cards in HTML
    // Pause on hover is handled via CSS animation-play-state
  }


  /* ------------------------------------------
     SCROLL-DRIVEN PROGRESS INDICATOR
     (thin accent bar at top of viewport)
  ------------------------------------------ */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'ftw_scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#0C4C91,#E8A838);z-index:9999;transition:width 0.1s linear;width:0;pointer-events:none;';
    document.body.appendChild(bar);

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ------------------------------------------
     INITIALIZE EVERYTHING
  ------------------------------------------ */
  function init() {
    // Parallax scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          updateHeroShapes();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Scroll reveal
    initScrollReveal();

    // Counter animation
    animateCounters();

    // Gallery loop
    initGalleryLoop();

    // Scroll progress bar
    initScrollProgress();

    // Algorithmic art canvases
    new AlgorithmicArt('ftw_hero-canvas', {
      particleCount: 50,
      maxDist: 180,
      speed: 0.3,
      shapes: true
    });

    new AlgorithmicArt('ftw_process-canvas', {
      particleCount: 35,
      maxDist: 140,
      speed: 0.25,
      particleColor: 'rgba(232,168,56,',
      lineColor: 'rgba(255,255,255,',
      secondaryColor: 'rgba(26,107,196,',
      shapes: true
    });

    new AlgorithmicArt('ftw_included-canvas', {
      particleCount: 40,
      maxDist: 160,
      speed: 0.2,
      particleColor: 'rgba(232,168,56,',
      lineColor: 'rgba(232,168,56,',
      secondaryColor: 'rgba(12,76,145,',
      shapes: true
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
