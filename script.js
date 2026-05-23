/* =====================================================
   SARVAJEETH UK — PORTFOLIO APPLICATION v3.0
   Immersive | Three.js | Command Palette | Theme Engine
   ===================================================== */

'use strict';

// ─── Performance Utilities ───────────────────────────
const debounce = (fn, ms = 100) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
};

const throttle = (fn, ms = 50) => {
    let lastTime = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastTime >= ms) {
            lastTime = now;
            fn(...args);
        }
    };
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ─── Audio Engine (Web Audio API) ────────────────────
const AudioEngine = {
    ctx: null,
    enabled: false,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return;
        }
        // Enable on first user interaction
        const enable = () => {
            this.enabled = true;
            document.removeEventListener('click', enable);
            document.removeEventListener('keydown', enable);
        };
        document.addEventListener('click', enable);
        document.addEventListener('keydown', enable);
    },

    play(type = 'hover') {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            if (type === 'hover') {
                osc.type = 'sine';
                osc.frequency.value = 800 + Math.random() * 400;
                gain.gain.value = 0.01;
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
                osc.start(this.ctx.currentTime);
                osc.stop(this.ctx.currentTime + 0.05);
            } else if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
                osc.start(this.ctx.currentTime);
                osc.stop(this.ctx.currentTime + 0.1);
            } else if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, this.ctx.currentTime);
                osc.frequency.setValueAtTime(659, this.ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(784, this.ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
                osc.start(this.ctx.currentTime);
                osc.stop(this.ctx.currentTime + 0.3);
            }
        } catch (e) { /* silent fail */ }
    }
};

// ─── App State Machine ──────────────────────────────
const App = {
    state: 'loading', // loading → ready
    modules: [],

    async init() {
        AudioEngine.init();
        await Loader.init();
        this.state = 'ready';
        this.modules = [
            Cursor,
            ThreeBackground,
            Spotlight,
            Navigation,
            TypeWriter,
            ScrollReveal,
            SkillBars,
            Counters,
            BackToTop,
            ContactForm,
            CardTilt,
            MagneticButtons,
            Parallax,
            ScrollProgressBar,
            CommandPalette,
            ThemeSystem,
            GitHubStats,
            CopyEmail,
            Toast
        ];
        this.modules.forEach(m => { if (m.init) m.init(); });
        console.log('%c ⚡ Sarvajeeth UK — Portfolio v3.0 ',
            'background: #0a0a0f; color: #00d4ff; font-size: 14px; font-weight: bold; padding: 8px 12px; border-radius: 4px; border: 1px solid #00d4ff;');
        console.log('%c🔧 Built with passion, precision, and Three.js 🚀',
            'color: #8b5cf6; font-size: 12px;');
        console.log('%c📬 sarvajeethuk@gmail.com', 'color: #06ffa5; font-size: 12px;');
    }
};

// ─── Smooth Scroll Handler ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close command palette if open
                if (CommandPalette.isOpen) CommandPalette.close();
            }
        });
    });

    App.init();
});

/* =====================================================
   LOADER
   ===================================================== */
const Loader = {
    el: null,
    percentEl: null,
    progressFill: null,
    statusEl: null,
    lines: [],

    async init() {
        this.el = $('#loader');
        this.percentEl = $('#loader-percent');
        this.progressFill = $('#progress-fill');
        this.statusEl = $('#loading-status');
        this.lines = [1, 2, 3, 4].map(i => $(`#loading-line-${i}`));
        if (!this.el) return;

        // Animate loading lines
        const statuses = [
            'Initializing neural networks...',
            'Loading 3D rendering engine...',
            'Calibrating interactive systems...',
            'Ready. Launching portfolio.'
        ];

        for (let i = 0; i < 4; i++) {
            await wait(i === 0 ? 300 : 600);
            if (i > 0 && this.lines[i]) {
                this.lines[i].style.opacity = '1';
            }
            if (this.statusEl) {
                this.statusEl.textContent = statuses[i];
            }
            // Update progress
            const pct = Math.min(100, (i + 1) * 25);
            if (this.percentEl) this.percentEl.textContent = pct + '%';
            if (this.progressFill) this.progressFill.style.width = pct + '%';
        }

        // Wait for window load
        await new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve, { once: true });
            }
        });

        // Extra wait for Three.js to start loading
        await wait(800);

        // Ensure progress is at 100%
        if (this.percentEl) this.percentEl.textContent = '100%';
        if (this.progressFill) this.progressFill.style.width = '100%';

        await wait(400);

        // Hide loader
        this.el.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
const Cursor = {
    el: null, dot: null, ring: null,
    pos: { x: 0, y: 0 }, mouse: { x: 0, y: 0 },

    init() {
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
        this.el = $('#cursor');
        this.dot = $('.cursor-dot', this.el);
        this.ring = $('.cursor-ring', this.el);
        if (!this.el) return;
        this.el.style.display = 'block';
        this.bindEvents();
        this.animate();
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        $$('a, button, .btn, .project-bento-item, .skill-category, .social-link, .skill-tag, .command-palette-item').forEach(el => {
            el.addEventListener('mouseenter', () => { this.el.classList.add('hover'); });
            el.addEventListener('mouseleave', () => { this.el.classList.remove('hover'); });
        });

        document.addEventListener('mouseleave', () => this.el.classList.add('hidden'));
        document.addEventListener('mouseenter', () => this.el.classList.remove('hidden'));
        document.addEventListener('mousedown', () => this.el.classList.add('active'));
        document.addEventListener('mouseup', () => this.el.classList.remove('active'));
    },

    animate() {
        this.pos.x += (this.mouse.x - this.pos.x) * 0.15;
        this.pos.y += (this.mouse.y - this.pos.y) * 0.15;
        if (this.dot) this.dot.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px)`;
        if (this.ring) this.ring.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
        requestAnimationFrame(() => this.animate());
    }
};

/* =====================================================
   THREE.JS 3D BACKGROUND
   ===================================================== */
const ThreeBackground = {
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    mesh: null,
    particles: null,
    mouse: { x: 0, y: 0 },
    targetRot: { x: 0, y: 0 },

    init() {
        this.canvas = $('#three-canvas');
        if (!this.canvas || typeof THREE === 'undefined') return;
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        this.setupScene();
        this.addTorusKnot();
        this.addParticles();
        this.bindEvents();
        this.setupCleanup();
        this.animate();
    },

    setupScene() {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 16;

        // Store for cleanup
        this._animationFrameId = null;

        // Resize handler
        window.addEventListener('resize', debounce(() => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);            }, 200));
    },

    setupCleanup() {
        const cleanup = () => {
            if (this._animationFrameId) {
                cancelAnimationFrame(this._animationFrameId);
                this._animationFrameId = null;
            }
            if (this.renderer) {
                this.renderer.dispose();
            }
            if (this.scene) {
                this.scene.traverse((obj) => {
                    if (obj.geometry) obj.geometry.dispose();
                    if (obj.material) {
                        if (Array.isArray(obj.material)) {
                            obj.material.forEach(m => m.dispose());
                        } else {
                            obj.material.dispose();
                        }
                    }
                });
            }
            // Remove references
            this.renderer = null;
            this.scene = null;
            this.camera = null;
            this.mesh = null;
            this.particles = null;
        };
        window.addEventListener('beforeunload', cleanup);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this._animationFrameId) {
                cancelAnimationFrame(this._animationFrameId);
                this._animationFrameId = null;
            } else if (!document.hidden && !this._animationFrameId && this.renderer) {
                this.animate();
            }
        });
    },

    addTorusKnot() {
        const geometry = new THREE.TorusKnotGeometry(2.8, 0.8, 200, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    },

    addParticles() {
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const radius = 12 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            sizes[i] = Math.random() * 2 + 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0x8b5cf6,
            size: 0.06,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.targetRot.x = (e.clientY / window.innerHeight - 0.5) * 0.5;
            this.targetRot.y = (e.clientX / window.innerWidth - 0.5) * 0.5;
        });
    },

    animate() {
        this._animationFrameId = requestAnimationFrame(() => this.animate());

        if (this.mesh) {
            this.mesh.rotation.x += (this.targetRot.x - this.mesh.rotation.x) * 0.02;
            this.mesh.rotation.y += (this.targetRot.y - this.mesh.rotation.y) * 0.02;
            this.mesh.rotation.z += 0.001;
        }

        if (this.particles) {
            this.particles.rotation.x += 0.0002;
            this.particles.rotation.y += 0.0003;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};

/* =====================================================
   SPOTLIGHT CURSOR OVERLAY
   ===================================================== */
const Spotlight = {
    el: null,

    init() {
        this.el = $('#spotlight');
        if (!this.el) return;

        document.addEventListener('mousemove', throttle((e) => {
            const x = e.clientX;
            const y = e.clientY;
            this.el.style.setProperty('--mx', x + 'px');
            this.el.style.setProperty('--my', y + 'px');
        }, 30));
    }
};

/* =====================================================
   THEME SYSTEM
   ===================================================== */
const ThemeSystem = {
    toggle: null,
    current: 'dark',

    init() {
        this.toggle = $('#theme-toggle');
        this.current = localStorage.getItem('theme') || 'dark';
        this.apply(this.current);

        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    toggleTheme() {
        const next = this.current === 'dark' ? 'light' : 'dark';
        AudioEngine.play('click');
        this.apply(next);
        localStorage.setItem('theme', next);
    },

    apply(theme) {
        this.current = theme;
        document.documentElement.className = theme;
        // Update theme-color meta
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.content = theme === 'dark' ? '#0a0a0f' : '#f4f4f8';
        }
    }
};

/* =====================================================
   COMMAND PALETTE
   ===================================================== */
const CommandPalette = {
    el: null,
    input: null,
    results: null,
    empty: null,
    items: [],
    isOpen: false,
    selectedIndex: -1,

    init() {
        this.el = $('#command-palette');
        this.input = $('#cmd-palette-input');
        this.results = $('#cmd-palette-results');
        this.empty = $('#cmd-palette-empty');
        if (!this.el) return;

        this.items = $$('.command-palette-item');
        this.bindEvents();

        // Open via toggle button
        const cmdToggle = $('#cmd-palette-toggle');
        if (cmdToggle) {
            cmdToggle.addEventListener('click', () => this.toggle());
        }

        // Open via footer button
        const footerBtn = $('#footer-cmd-btn');
        if (footerBtn) {
            footerBtn.addEventListener('click', () => this.open());
        }

        // Open via keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },

    bindEvents() {
        // Search/filter
        if (this.input) {
            this.input.addEventListener('input', () => this.filter());
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.selectNext();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.selectPrev();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeSelected();
                }
            });
        }

        // Click items
        this.items.forEach((item, i) => {
            item.addEventListener('click', () => {
                this.selectedIndex = i;
                this.executeSelected();
            });
            item.addEventListener('mouseenter', () => {
                this.selectedIndex = i;
                this.updateSelection();
            });
        });

        // Close on overlay click
        const overlay = $('.command-palette-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }
    },

    toggle() {
        this.isOpen ? this.close() : this.open();
    },

    open() {
        this.isOpen = true;
        this.el.removeAttribute('hidden');
        this.el.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (this.input) {
            this.input.value = '';
            this.input.focus();
        }
        this.filter();
        this.selectedIndex = -1;
        this.updateSelection();
    },

    close() {
        this.isOpen = false;
        this.el.classList.remove('open');
        document.body.style.overflow = '';
        if (this.input) this.input.blur();
    },

    filter() {
        const query = (this.input ? this.input.value : '').toLowerCase().trim();
        let visibleCount = 0;

        this.items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const match = !query || text.includes(query);
            item.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        // Show/hide groups based on visible children
        $$('.command-palette-group').forEach(group => {
            const visibleItems = group.querySelectorAll('.command-palette-item[style*="display: none"]');
            const totalItems = group.querySelectorAll('.command-palette-item').length;
            group.style.display = visibleItems.length === totalItems ? 'none' : '';
        });

        if (this.empty) {
            this.empty.hidden = visibleCount > 0;
        }

        this.selectedIndex = -1;
        this.updateSelection();
    },

    selectNext() {
        const visible = this.getVisibleItems();
        if (visible.length === 0) return;
        this.selectedIndex = (this.selectedIndex + 1) % visible.length;
        this.updateSelection();
        this.scrollToSelected();
    },

    selectPrev() {
        const visible = this.getVisibleItems();
        if (visible.length === 0) return;
        this.selectedIndex = (this.selectedIndex - 1 + visible.length) % visible.length;
        this.updateSelection();
        this.scrollToSelected();
    },

    getVisibleItems() {
        return this.items.filter(item => item.style.display !== 'none');
    },

    updateSelection() {
        this.items.forEach((item, i) => {
            const visible = this.getVisibleItems();
            const visibleIdx = visible.indexOf(item);
            item.classList.toggle('selected', visibleIdx === this.selectedIndex);
        });
    },

    scrollToSelected() {
        const visible = this.getVisibleItems();
        const selected = visible[this.selectedIndex];
        if (selected) {
            selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    },

    executeSelected() {
        const visible = this.getVisibleItems();
        const selected = visible[this.selectedIndex];
        if (selected) {
            this.executeItem(selected);
        } else if (visible.length > 0) {
            this.executeItem(visible[0]);
        }
    },

    executeItem(item) {
        const action = item.dataset.action;
        AudioEngine.play('click');

        switch (action) {
            case 'navigate': {
                const target = item.dataset.target;
                if (target) {
                    const el = document.querySelector(target);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                this.close();
                break;
            }
            case 'theme':
                ThemeSystem.toggleTheme();
                this.close();
                break;
            case 'resume': {
                const link = document.querySelector('a[download]');
                if (link) link.click();
                this.close();
                break;
            }
            case 'email':
                CopyEmail.copy();
                Toast.show('Email address copied!');
                this.close();
                break;
            case 'top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.close();
                break;
        }
    }
};

/* =====================================================
   GITHUB STATS
   ===================================================== */
const GitHubStats = {
    init() {
        const mini = $('#github-mini');
        if (!mini) return;
        this.fetchStats();
    },

    async fetchStats() {
        try {
            const res = await fetch('https://api.github.com/users/Sarvajeet2003/repos?per_page=100&sort=updated');
            if (!res.ok) throw new Error('GitHub API error');
            const repos = await res.json();

            const totalRepos = repos.length;
            const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
            const languages = new Set(repos.filter(r => r.language).map(r => r.language));
            const topLangs = [...languages].slice(0, 5).join(', ');

            // Update mini widget
            const reposEl = $('#gh-repos');
            const starsEl = $('#gh-stars');
            const langsEl = $('#gh-langs');

            if (reposEl) reposEl.textContent = totalRepos;
            if (starsEl) starsEl.textContent = totalStars;
            if (langsEl) langsEl.textContent = languages.size;
        } catch (e) {
            // Silently fail - stats are non-critical
            const reposEl = $('#gh-repos');
            const starsEl = $('#gh-stars');
            const langsEl = $('#gh-langs');
            if (reposEl) reposEl.textContent = '—';
            if (starsEl) starsEl.textContent = '—';
            if (langsEl) langsEl.textContent = '—';
        }
    }
};

/* =====================================================
   COPY EMAIL BUTTON
   ===================================================== */
const CopyEmail = {
    btn: null,

    init() {
        this.btn = $('#copy-email-btn');
        if (!this.btn) return;

        this.btn.addEventListener('click', () => this.copy());
    },

    copy() {
        const email = 'sarvajeethuk@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            AudioEngine.play('success');
            this.btn.classList.add('copied');
            const text = this.btn.querySelector('.copy-text');
            if (text) text.textContent = 'Copied!';
            setTimeout(() => {
                this.btn.classList.remove('copied');
                if (text) text.textContent = 'Copy';
            }, 2000);
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = email;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    }
};

/* =====================================================
   TOAST NOTIFICATION
   ===================================================== */
const Toast = {
    el: null,
    messageEl: null,
    timeout: null,

    init() {
        this.el = $('#toast');
        this.messageEl = $('#toast-message');
    },

    show(message, duration = 2000) {
        if (!this.el || !this.messageEl) return;
        if (this.timeout) clearTimeout(this.timeout);

        this.messageEl.textContent = message;
        this.el.hidden = false;
        // Force reflow
        void this.el.offsetWidth;
        this.el.classList.add('visible');

        this.timeout = setTimeout(() => {
            this.el.classList.remove('visible');
            setTimeout(() => { this.el.hidden = true; }, 300);
        }, duration);
    }
};

/* =====================================================
   NAVIGATION
   ===================================================== */
const Navigation = {
    navbar: null, toggle: null, menu: null, links: [], sections: [], isOpen: false,

    init() {
        this.navbar = $('#navbar');
        this.toggle = $('#menu-toggle');
        this.menu = $('#nav-menu');
        this.links = $$('.nav-link');
        this.sections = $$('section[id]');
        if (!this.navbar) return;
        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        window.addEventListener('scroll', throttle(() => this.handleScroll()), { passive: true });
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMenu(); });
        }
        this.links.forEach(link => {
            link.addEventListener('click', (e) => { this.closeMenu(); this.setActive(link); });
        });
        document.addEventListener('click', (e) => {
            if (this.isOpen && this.menu && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.isOpen) this.closeMenu(); });
    },

    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);
        let current = '';
        const scrollPos = window.scrollY + 120;
        for (const section of this.sections) {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                current = section.id; break;
            }
        }
        this.links.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${current}`);
        });
    },

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.toggle.classList.toggle('active', this.isOpen);
        this.menu.classList.toggle('active', this.isOpen);
        this.toggle.setAttribute('aria-expanded', this.isOpen);
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    },

    closeMenu() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    },

    setActive(activeLink) {
        this.links.forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
    }
};

/* =====================================================
   TYPEWRITER
   ===================================================== */
const TypeWriter = {
    el: null,
    words: ['GenAI Engineer', 'Backend Developer', 'ML Enthusiast', 'Web3 Builder', 'Problem Solver'],
    wordIndex: 0, charIndex: 0, isDeleting: false,

    init() {
        this.el = $('#typed-text');
        if (!this.el) return;
        this.type();
    },

    type() {
        const word = this.words[this.wordIndex];
        if (this.isDeleting) { this.charIndex--; this.el.textContent = word.substring(0, this.charIndex); }
        else { this.charIndex++; this.el.textContent = word.substring(0, this.charIndex); }
        let speed = this.isDeleting ? 40 : 80;
        if (!this.isDeleting && this.charIndex === word.length) { speed = 2000; this.isDeleting = true; }
        else if (this.isDeleting && this.charIndex === 0) { this.isDeleting = false; this.wordIndex = (this.wordIndex + 1) % this.words.length; speed = 400; }
        setTimeout(() => this.type(), speed);
    }
};

/* =====================================================
   SCROLL REVEAL
   ===================================================== */
const ScrollReveal = {
    observer: null,

    init() {
        const els = $$('[data-reveal]');
        if (!els.length) return;
        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseFloat(el.dataset.delay) || 0;
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, delay * 1000);
                    this.observer.unobserve(el);
                }
            }
        }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.05 });
        els.forEach(el => this.observer.observe(el));
    }
};

/* =====================================================
   SKILL BARS
   ===================================================== */
const SkillBars = {
    observer: null,

    init() {
        const fills = $$('.skill-bar-fill');
        if (!fills.length) return;
        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.dataset.width || '0%';
                    setTimeout(() => { bar.style.width = width; bar.classList.add('animated'); }, 200);
                    this.observer.unobserve(bar);
                }
            }
        }, { threshold: 0.3 });
        fills.forEach(bar => this.observer.observe(bar));
    }
};

/* =====================================================
   COUNTER ANIMATIONS
   ===================================================== */
const Counters = {
    observer: null,

    init() {
        const statNumbers = $$('.stat-number');
        if (!statNumbers.length) return;
        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const els = entry.target.querySelectorAll('.stat-number');
                    if (els.length) { els.forEach(el => this.animateNumber(el)); }
                    else { this.animateNumber(entry.target); }
                    this.observer.unobserve(entry.target);
                }
            }
        }, { threshold: 0.5 });
        const target = $('.about-stats');
        if (target) this.observer.observe(target);
    },

    animateNumber(el) {
        const raw = el.dataset.target || el.textContent.replace(/[^0-9]/g, '');
        const target = parseInt(raw);
        const suffix = el.dataset.suffix || (el.textContent.includes('+') ? '+' : '');
        if (!target) return;
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 40));
        const duration = 1500;
        const stepTime = Math.max(10, Math.floor(duration / (target / increment)));
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { el.textContent = target + suffix; clearInterval(timer); }
            else { el.textContent = current + suffix; }
        }, stepTime);
    }
};

/* =====================================================
   BACK TO TOP
   ===================================================== */
const BackToTop = {
    btn: null,

    init() {
        this.btn = $('#back-to-top');
        if (!this.btn) return;
        window.addEventListener('scroll', throttle(() => {
            this.btn.classList.toggle('visible', window.scrollY > 500);
        }, 100), { passive: true });
        this.btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

/* =====================================================
   SCROLL PROGRESS BAR
   ===================================================== */
const ScrollProgressBar = {
    bar: null,

    init() {
        this.bar = $('#scroll-progress');
        if (!this.bar) return;
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            this.bar.style.width = progress + '%';
        }, { passive: true });
    }
};

/* =====================================================
   CONTACT FORM
   ===================================================== */
const ContactForm = {
    form: null,

    init() {
        this.form = $('#contact-form');
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        $$('.form-input[required]', this.form).forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) this.validateField(input);
            });
        });
    },

    validateField(input) {
        const errorEl = input.closest('.form-group').querySelector('.form-error');
        const value = input.value.trim();
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) { this.setError(input, errorEl, 'Email is required'); return false; }
            else if (!emailRegex.test(value)) { this.setError(input, errorEl, 'Please enter a valid email'); return false; }
        } else if (input.id === 'form-name') {
            if (!value) { this.setError(input, errorEl, 'Name is required'); return false; }
            else if (value.length < 2) { this.setError(input, errorEl, 'Name must be at least 2 characters'); return false; }
        } else if (input.id === 'form-message') {
            if (!value) { this.setError(input, errorEl, 'Message is required'); return false; }
            else if (value.length < 10) { this.setError(input, errorEl, 'Please write at least 10 characters'); return false; }
        }
        this.clearError(input, errorEl);
        return true;
    },

    setError(input, errorEl, message) { input.classList.add('error'); if (errorEl) errorEl.textContent = message; },
    clearError(input, errorEl) { input.classList.remove('error'); if (errorEl) errorEl.textContent = ''; },

    async handleSubmit(e) {
        e.preventDefault();
        const requiredInputs = $$('[required]', this.form);
        let isValid = true;
        for (const input of requiredInputs) {
            if (!this.validateField(input)) isValid = false;
        }
        if (!isValid) return;
        const btn = this.form.querySelector('.btn-submit');
        btn.classList.add('sending');
        AudioEngine.play('click');
        await wait(1500);
        btn.classList.remove('sending');
        btn.classList.add('sent');
        AudioEngine.play('success');
        await wait(2000);
        btn.classList.remove('sent');
        this.form.reset();
    }
};

/* =====================================================
   CARD TILT (3D Perspective Effect)
   ===================================================== */
const CardTilt = {
    init() {
        const cards = $$('.project-bento-item, .skill-category');
        for (const card of cards) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotateX = (y - cy) / 25;
                const rotateY = (cx - x) / 25;
                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                });
            });
            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
                });
            });
        }
    }
};

/* =====================================================
   MAGNETIC BUTTONS
   ===================================================== */
const MagneticButtons = {
    init() {
        const btns = $$('.btn, .social-link');
        for (const btn of btns) {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const strength = btn.classList.contains('social-link') ? 0.15 : 0.08;
                btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        }
    }
};

/* =====================================================
   PARALLAX (Floating Shapes)
   ===================================================== */
const Parallax = {
    shapes: [],

    init() {
        this.shapes = $$('.shape');
        if (!this.shapes.length) return;
        document.addEventListener('mousemove', throttle((e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const x = (e.clientX - cx) / cx;
            const y = (e.clientY - cy) / cy;
            for (const shape of this.shapes) {
                const speed = parseFloat(shape.dataset.speed) || 0.02;
                shape.style.transform = `translate(${x * speed * 100}px, ${y * speed * 100}px)`;
            }
        }, 30));
    }
};
