// Main JavaScript functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    initNavigation();
    initTypingEffect();
    initSmoothScrolling();
    initScrollSpy();
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'hsla(var(--glass-bg))';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'hsla(var(--glass-bg))';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
}

// Typing effect for hero section
function initTypingEffect() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) {
        console.error('Typing text element not found');
        return;
    }
    
    console.log('Typing element found, starting animation...');
    
    const texts = [
        'Full Stack Developer',
        'Full Stack Developer',
        'Full Stack Developer',
        'Full Stack Developer',
        'Full Stack Developer'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (!isDeleting) {
            charIndex++;
            typingText.textContent = currentText.substring(0, charIndex);
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
        } else {
            charIndex--;
            typingText.textContent = currentText.substring(0, charIndex);
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
        }
        
        setTimeout(type, isDeleting ? 50 : 100);
    }
    
    // Test if element can be modified
    typingText.textContent = 'Testing...';
    setTimeout(() => {
        typingText.textContent = '';
        type();
    }, 1000);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                window.scrollBy({
                    top: elementPosition - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll spy for active navigation links
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        let currentActive = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust offset for header
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentActive = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveLink, 100));
    updateActiveLink(); // Initial call
}

// Initialize ScrollReveal
function initScrollReveal() {
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.hero-content, .section-header, .about-content, .projects-grid, .timeline-item, .contact-info, .contact-form-container', {
            delay: 200,
            distance: '50px',
            origin: 'bottom',
            interval: 100,
            easing: 'ease-in-out',
            reset: false
        });
    } else {
        console.warn('ScrollReveal not loaded. Skipping animations.');
    }
}

// Utility function for throttling
function throttle(func, wait) {
    let inThrottle, lastFn, lastTime;
    return function executedFunction(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(function() {
                if (Date.now() - lastTime >= wait) {
                    func.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.removeAttribute('data-src');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.removeAttribute('data-src');
        });
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('success-modal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
        
        // Close mobile menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        // Replace broken images with placeholder
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
        e.target.alt = 'Image not available';
    }
}, true);

// Console welcome message
console.log(`
🚀 Welcome to Affan Zahid's Portfolio!
🎨 Built with vanilla HTML, CSS, and JavaScript
💡 Featuring glassmorphism design and smooth animations
📱 Fully responsive and accessible
🌙 Dark mode support included

Feel free to explore the code and get in touch!
`);
