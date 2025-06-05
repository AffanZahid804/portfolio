// Theme management and dark mode functionality

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.theme);
        
        // Bind events
        this.bindEvents();
        
        // Watch for system theme changes
        this.watchSystemTheme();
    }

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    watchSystemTheme() {
        this.prefersDarkScheme.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme-manual')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update toggle button icon
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChange', { 
            detail: { theme } 
        }));
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Mark as manually set
        localStorage.setItem('theme-manual', 'true');
        
        // Add toggle animation
        this.animateToggle();
    }

    animateToggle() {
        if (this.themeToggle) {
            this.themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.themeToggle.style.transform = '';
            }, 300);
        }

        // Add a subtle flash effect
        document.body.style.transition = 'background-color 0.3s ease';
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.theme === 'dark' ? '#ffffff' : '#000000'};
            opacity: 0.1;
            pointer-events: none;
            z-index: 10000;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(flash);
            }, 300);
        }, 50);
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        const colors = {
            light: '#F5F7FA',
            dark: '#0A0E1A'
        };

        metaThemeColor.content = colors[theme];
    }

    getTheme() {
        return this.theme;
    }

    isDark() {
        return this.theme === 'dark';
    }
}

// Color scheme utilities
class ColorSchemeUtils {
    static getComputedCustomProperty(property) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(property)
            .trim();
    }

    static setCustomProperty(property, value) {
        document.documentElement.style.setProperty(property, value);
    }

    static generateColorVariations(baseColor, variations = 5) {
        const colors = [];
        const [h, s, l] = baseColor.match(/\d+/g).map(Number);
        
        for (let i = 0; i < variations; i++) {
            const lightness = Math.max(10, Math.min(90, l + (i - 2) * 15));
            colors.push(`${h} ${s}% ${lightness}%`);
        }
        
        return colors;
    }

    static contrastRatio(color1, color2) {
        const getRGB = (color) => {
            const [h, s, l] = color.match(/\d+/g).map(Number);
            // Convert HSL to RGB (simplified)
            const hue = h / 360;
            const saturation = s / 100;
            const lightness = l / 100;
            
            const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
            const x = c * (1 - Math.abs((hue * 6) % 2 - 1));
            const m = lightness - c / 2;
            
            let r, g, b;
            if (hue < 1/6) [r, g, b] = [c, x, 0];
            else if (hue < 2/6) [r, g, b] = [x, c, 0];
            else if (hue < 3/6) [r, g, b] = [0, c, x];
            else if (hue < 4/6) [r, g, b] = [0, x, c];
            else if (hue < 5/6) [r, g, b] = [x, 0, c];
            else [r, g, b] = [c, 0, x];
            
            return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
        };

        const getLuminance = (rgb) => {
            const [r, g, b] = rgb.map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const lum1 = getLuminance(getRGB(color1));
        const lum2 = getLuminance(getRGB(color2));
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);

        return (brightest + 0.05) / (darkest + 0.05);
    }
}

// Theme-aware animations
class ThemeAnimations {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.init();
    }

    init() {
        window.addEventListener('themeChange', (e) => {
            this.onThemeChange(e.detail.theme);
        });
    }

    onThemeChange(theme) {
        // Animate glass cards
        this.animateGlassCards(theme);
        
        // Animate navigation
        this.animateNavigation(theme);
        
        // Update particle colors
        this.updateParticleColors(theme);
    }

    animateGlassCards(theme) {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 100);
            }, index * 50);
        });
    }

    animateNavigation(theme) {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.style.transition = 'all 0.3s ease';
            navbar.style.transform = 'translateY(-2px)';
            
            setTimeout(() => {
                navbar.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    updateParticleColors(theme) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const hue = theme === 'dark' ? Math.random() * 60 + 200 : Math.random() * 60 + 160;
            particle.style.background = `hsl(${hue}, 70%, ${theme === 'dark' ? '60%' : '50%'})`;
        });
    }
}

// Auto theme based on time of day
class AutoTheme {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.enabled = localStorage.getItem('auto-theme') === 'true';
        this.init();
    }

    init() {
        if (this.enabled) {
            this.updateThemeByTime();
            
            // Check every hour
            setInterval(() => {
                this.updateThemeByTime();
            }, 3600000);
        }
    }

    updateThemeByTime() {
        const hour = new Date().getHours();
        const isDaytime = hour >= 6 && hour < 18;
        const suggestedTheme = isDaytime ? 'light' : 'dark';
        
        if (this.themeManager.getTheme() !== suggestedTheme) {
            this.themeManager.setTheme(suggestedTheme);
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('auto-theme', this.enabled.toString());
        
        if (this.enabled) {
            this.updateThemeByTime();
        }
    }
}

// Theme persistence across pages
class ThemePersistence {
    constructor() {
        this.syncAcrossTabs();
    }

    syncAcrossTabs() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                document.documentElement.setAttribute('data-theme', e.newValue);
                
                // Update toggle button
                const themeToggle = document.getElementById('theme-toggle');
                if (themeToggle) {
                    const icon = themeToggle.querySelector('i');
                    if (icon) {
                        icon.className = e.newValue === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                    }
                }
            }
        });
    }
}

// Initialize theme management
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    new ThemeAnimations(themeManager);
    new AutoTheme(themeManager);
    new ThemePersistence();
    
    // Expose theme manager globally for debugging
    window.themeManager = themeManager;
    
    // Theme debugging in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🎨 Theme Manager initialized');
        console.log('Current theme:', themeManager.getTheme());
        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(themeManager)));
    }
});

// Theme transition optimization
document.addEventListener('DOMContentLoaded', () => {
    // Prevent flash of unstyled content
    document.body.style.transition = 'none';
    
    setTimeout(() => {
        document.body.style.transition = '';
    }, 100);
});

// Export for external use
window.ThemeManager = ThemeManager;
window.ColorSchemeUtils = ColorSchemeUtils;
