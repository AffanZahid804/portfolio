// Main JavaScript functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    initNavigation();
    initTypingEffect();
    initContactForm();
    // initScrollReveal();
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
        'Creative Frontend Developer',
        'Web Developer', 
        'UI Designer',
        'JavaScript Enthusiast'
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

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearFormErrors();
            
            // Validate form
            if (validateForm()) {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.classList.add('loading');
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    form.reset();
                    showSuccessModal();
                }, 2000);
            }
        });
    }
    
    // Modal close functionality
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// Form validation
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    // Name validation
    if (!name.value.trim()) {
        showFieldError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError(email, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!subject.value.trim()) {
        showFieldError(subject, 'Subject is required');
        isValid = false;
    }
    
    // Message validation
    if (!message.value.trim()) {
        showFieldError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorMessage.textContent = message;
}

// Clear form errors
function clearFormErrors() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        errorMessage.textContent = '';
    });
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('active');
    }
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
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ScrollSpy functionality
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveLink, 100));
    updateActiveLink(); // Initial call
}

// Scroll reveal animations
function initScrollReveal() {
    // const revealElements = document.querySelectorAll('.glass-card, .project-card, .timeline-item, .skill-item');
    
    // function revealOnScroll() {
    //     revealElements.forEach(element => {
    //         const elementTop = element.getBoundingClientRect().top;
    //         const elementVisible = 150;
            
    //         if (elementTop < window.innerHeight - elementVisible) {
    //             element.classList.add('reveal');
    //         }
    //     });
    // }
    
    // // Add reveal classes with staggered delays
    // revealElements.forEach((element, index) => {
    //     element.style.transitionDelay = `${index * 0.1}s`;
    // });
    
    // window.addEventListener('scroll', throttle(revealOnScroll, 100));
    // revealOnScroll(); // Initial call
}

// Utility function to throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to debounce events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Skill item hover effects
// document.addEventListener('DOMContentLoaded', function() {
//     const skillItems = document.querySelectorAll('.skill-item');
    
//     skillItems.forEach(item => {
//         item.addEventListener('mouseenter', function() {
//             const skill = this.getAttribute('data-skill');
//             if (skill) {
//                 // Add pulse animation
//                 this.style.animation = 'pulse 0.6s ease-in-out';
                
//                 // Reset animation
//                 setTimeout(() => {
//                     this.style.animation = '';
//                 }, 600);
//             }
//         });
//     });
// });

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
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
🚀 Welcome to Alex Carter's Portfolio!
🎨 Built with vanilla HTML, CSS, and JavaScript
💡 Featuring glassmorphism design and smooth animations
📱 Fully responsive and accessible
🌙 Dark mode support included

Feel free to explore the code and get in touch!
`);
