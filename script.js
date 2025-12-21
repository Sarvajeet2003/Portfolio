/* =====================================================
   SARVAJEETH UK - PORTFOLIO WEBSITE
   JavaScript: Animations & Interactions
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Loader.init();
    NeuralNetwork.init();
    Navigation.init();
    TypeWriter.init();
    ScrollAnimations.init();
});

/* =====================================================
   LOADER
   ===================================================== */
const Loader = {
    init() {
        const loader = document.getElementById('loader');
        if (!loader) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 1800);
        });
        
        // Fallback in case of slow load
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 3000);
    }
};

/* =====================================================
   NEURAL NETWORK ANIMATION
   ===================================================== */
const NeuralNetwork = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    animationId: null,
    
    config: {
        particleCount: 80,
        particleColor: 'rgba(0, 212, 255, 0.6)',
        lineColor: 'rgba(0, 212, 255, 0.15)',
        particleSize: { min: 1, max: 3 },
        speed: { min: 0.2, max: 0.8 },
        connectionDistance: 150,
        mouseRadius: 150
    },
    
    init() {
        this.canvas = document.getElementById('neural-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    createParticles() {
        this.particles = [];
        const { particleCount, particleSize, speed } = this.config;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
                speedX: (Math.random() - 0.5) * (speed.max - speed.min) + speed.min,
                speedY: (Math.random() - 0.5) * (speed.max - speed.min) + speed.min,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    },
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    },
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.particleColor.replace('0.6', particle.opacity);
        this.ctx.fill();
    },
    
    drawConnections() {
        const { connectionDistance, lineColor, mouseRadius } = this.config;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = lineColor.replace('0.15', opacity);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
            
            // Mouse connection
            if (this.mouse.x && this.mouse.y) {
                const dx = this.particles[i].x - this.mouse.x;
                const dy = this.particles[i].y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseRadius) {
                    const opacity = (1 - distance / mouseRadius) * 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    },
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Mouse repulsion
            if (this.mouse.x && this.mouse.y) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.x += (dx / distance) * force * 2;
                    particle.y += (dy / distance) * force * 2;
                }
            }
        });
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.particles.forEach(p => this.drawParticle(p));
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};

/* =====================================================
   NAVIGATION
   ===================================================== */
const Navigation = {
    navbar: null,
    menuToggle: null,
    navMenu: null,
    navLinks: null,
    sections: null,
    
    init() {
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menu-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        if (!this.navbar) return;
        
        this.bindEvents();
        this.handleScroll();
    },
    
    bindEvents() {
        // Scroll event for navbar
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                this.setActiveLink(link);
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    },
    
    handleScroll() {
        // Add scrolled class
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        let current = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    },
    
    toggleMenu() {
        this.menuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    },
    
    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    },
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
};

/* =====================================================
   TYPEWRITER EFFECT
   ===================================================== */
const TypeWriter = {
    element: null,
    words: [
        'GenAI Engineer',
        'Backend Developer',
        'ML Enthusiast',
        'Web3 Builder',
        'Problem Solver'
    ],
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typeSpeed: 100,
    deleteSpeed: 50,
    pauseTime: 2000,
    
    init() {
        this.element = document.getElementById('typed-text');
        if (!this.element) return;
        
        this.type();
    },
    
    type() {
        const currentWord = this.words[this.wordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.charIndex === currentWord.length) {
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            speed = 500;
        }
        
        setTimeout(() => this.type(), speed);
    }
};

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
const ScrollAnimations = {
    observerOptions: {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    },
    
    init() {
        this.observeElements();
        this.initSmoothScroll();
    },
    
    observeElements() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        if (!animatedElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, this.observerOptions);
        
        animatedElements.forEach(el => observer.observe(el));
    },
    
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

/* =====================================================
   ADDITIONAL MICRO-INTERACTIONS
   ===================================================== */

// Card 3D tilt effect
document.querySelectorAll('.project-card, .skill-category').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Magnetic button effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// Image reveal animation
const observerOptions = {
    threshold: 0.3
};

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

document.querySelectorAll('.about-image-wrapper').forEach(img => {
    imageObserver.observe(img);
});

// Stats counter animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    counterObserver.observe(aboutStats);
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const suffix = element.textContent.includes('+') ? '+' : '';
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
}

// Console Easter Egg
console.log('%c👋 Hey there, curious developer!', 'font-size: 24px; font-weight: bold; color: #00d4ff;');
console.log('%cInterested in how this portfolio was built?', 'font-size: 14px; color: #8b5cf6;');
console.log('%cCheck out my GitHub: https://github.com/Sarvajeet2003', 'font-size: 12px; color: #06ffa5;');
