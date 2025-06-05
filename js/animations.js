// Advanced animation utilities and effects

// Animation utilities
const AnimationUtils = {
    // Easing functions
    easing: {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: t => t * t * t * t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeOutBounce: t => {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (t < 1 / d1) {
                return n1 * t * t;
            } else if (t < 2 / d1) {
                return n1 * (t -= 1.5 / d1) * t + 0.75;
            } else if (t < 2.5 / d1) {
                return n1 * (t -= 2.25 / d1) * t + 0.9375;
            } else {
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        }
    },

    // Animate function
    animate(element, properties, duration = 1000, easing = 'easeOutQuad', callback = null) {
        const start = performance.now();
        const startValues = {};
        const endValues = {};

        // Get starting values
        for (const prop in properties) {
            if (prop === 'opacity') {
                startValues[prop] = parseFloat(getComputedStyle(element).opacity) || 0;
            } else if (prop === 'transform') {
                startValues[prop] = element.style.transform || '';
            } else {
                startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
            }
            endValues[prop] = properties[prop];
        }

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easing[easing](progress);

            for (const prop in properties) {
                if (prop === 'opacity') {
                    element.style.opacity = startValues[prop] + (endValues[prop] - startValues[prop]) * easedProgress;
                } else if (prop === 'transform') {
                    element.style.transform = endValues[prop];
                } else {
                    const value = startValues[prop] + (endValues[prop] - startValues[prop]) * easedProgress;
                    element.style[prop] = value + 'px';
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };

        requestAnimationFrame(animate);
    },

    // Stagger animations
    stagger(elements, properties, duration = 1000, delay = 100, easing = 'easeOutQuad') {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animate(element, properties, duration, easing);
            }, index * delay);
        });
    }
};

// Intersection Observer for scroll animations
class ScrollAnimator {
    constructor() {
        this.observers = new Map();
        this.init();
    }

    init() {
        this.createObserver('fade-in', this.fadeInAnimation.bind(this));
        this.createObserver('slide-up', this.slideUpAnimation.bind(this));
        this.createObserver('slide-left', this.slideLeftAnimation.bind(this));
        this.createObserver('slide-right', this.slideRightAnimation.bind(this));
        this.createObserver('scale-in', this.scaleInAnimation.bind(this));
        this.createObserver('rotate-in', this.rotateInAnimation.bind(this));
    }

    createObserver(className, callback) {
        const elements = document.querySelectorAll(`.${className}`);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });

        this.observers.set(className, observer);
    }

    fadeInAnimation(element) {
        element.style.opacity = '0';
        AnimationUtils.animate(element, { opacity: 1 }, 800, 'easeOutQuad');
    }

    slideUpAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        AnimationUtils.animate(element, { opacity: 1 }, 800, 'easeOutQuad');
        setTimeout(() => {
            element.style.transform = 'translateY(0)';
        }, 50);
    }

    slideLeftAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        AnimationUtils.animate(element, { opacity: 1 }, 800, 'easeOutQuad');
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, 50);
    }

    slideRightAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        AnimationUtils.animate(element, { opacity: 1 }, 800, 'easeOutQuad');
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, 50);
    }

    scaleInAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        AnimationUtils.animate(element, { opacity: 1 }, 800, 'easeOutBack');
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 50);
    }

    rotateInAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-10deg) scale(0.8)';
        AnimationUtils.animate(element, { opacity: 1 }, 800, 'easeOutQuad');
        setTimeout(() => {
            element.style.transform = 'rotate(0deg) scale(1)';
        }, 50);
    }
}

// Mouse parallax effect
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove(e) {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        this.elements.forEach(element => {
            const speed = element.dataset.parallax || 0.1;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;

            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// Magnetic button effect
class MagneticEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .social-link');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', this.handleMouseEnter.bind(this, button));
            button.addEventListener('mouseleave', this.handleMouseLeave.bind(this, button));
            button.addEventListener('mousemove', this.handleMouseMove.bind(this, button));
        });
    }

    handleMouseEnter(button) {
        button.style.transition = 'none';
    }

    handleMouseLeave(button) {
        button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        button.style.transform = 'translate(0, 0)';
    }

    handleMouseMove(button, e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * 0.3;
        const moveY = y * 0.3;

        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
}

// Text reveal animation
class TextReveal {
    constructor() {
        this.elements = document.querySelectorAll('.text-reveal');
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            this.splitText(element);
        });

        this.observeElements();
    }

    splitText(element) {
        const text = element.textContent;
        element.innerHTML = '';

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all 0.5s ease ${index * 0.03}s`;
            element.appendChild(span);
        });
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Floating particles effect
class ParticleEffect {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        if (!this.container) return;

        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: hsl(${Math.random() * 60 + 200}, 70%, 60%);
                border-radius: 50%;
                pointer-events: none;
                opacity: ${Math.random() * 0.5 + 0.2};
            `;

            particle.x = Math.random() * this.container.offsetWidth;
            particle.y = Math.random() * this.container.offsetHeight;
            particle.vx = (Math.random() - 0.5) * 0.5;
            particle.vy = (Math.random() - 0.5) * 0.5;

            this.particles.push(particle);
            this.container.appendChild(particle);
        }
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.container.offsetWidth) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.container.offsetHeight) {
                particle.vy *= -1;
            }

            particle.style.left = particle.x + 'px';
            particle.style.top = particle.y + 'px';
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Custom cursor effect
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.init();
    }

    init() {
        if (window.innerWidth < 768) return; // Disable on mobile

        this.createCursor();
        this.bindEvents();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 1px solid hsl(var(--primary) / 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            mix-blend-mode: difference;
        `;

        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';
        this.cursorDot.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: hsl(var(--primary));
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: all 0.05s ease;
        `;

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 20 + 'px';
            this.cursor.style.top = e.clientY - 20 + 'px';
            this.cursorDot.style.left = e.clientX - 3 + 'px';
            this.cursorDot.style.top = e.clientY - 3 + 'px';
        });

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .btn, input, textarea');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursor.style.background = 'hsl(var(--primary) / 0.1)';
            });

            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.background = 'transparent';
            });
        });
    }
}

// Initialize all animation effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animator
    new ScrollAnimator();

    // Initialize parallax effect
    new ParallaxEffect();

    // Initialize magnetic effect
    new MagneticEffect();

    // Initialize text reveal
    new TextReveal();

    // Initialize custom cursor
    new CustomCursor();

    // Initialize particle effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleEffect(heroSection);
    }

    // Add loading animation to page
    document.body.style.opacity = '0';
    AnimationUtils.animate(document.body, { opacity: 1 }, 1000, 'easeOutQuad');
});

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
            console.log(`Animation: ${entry.name} took ${entry.duration}ms`);
        }
    });
});

if (typeof PerformanceObserver !== 'undefined') {
    perfObserver.observe({ entryTypes: ['measure'] });
}

// Export utilities for external use
window.AnimationUtils = AnimationUtils;
