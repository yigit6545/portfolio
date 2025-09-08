// Enhanced Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

// Update theme toggle icon
updateThemeIcon(currentTheme);

// Enhanced theme toggle with animations
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition class for smooth animation
    body.classList.add('theme-transitioning');
    
    // Update theme
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon with animation
    updateThemeIcon(newTheme);
    
    // Track theme change
    if (typeof trackEvent === 'function') {
        trackEvent('theme_change', 'ui', newTheme, 1);
    }
    
    // Remove transition class after animation
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 300);
});

function updateThemeIcon(theme) {
    const icon = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeToggle.innerHTML = icon;
    
    // Add rotation animation
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
}

// Auto theme detection based on system preference
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if (!localStorage.getItem('theme')) {
            body.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

// Initialize system theme detection
detectSystemTheme();

// Language Toggle (Enhanced)
const languageToggle = document.getElementById('language-toggle');
if (languageToggle) {
    const langText = languageToggle.querySelector('.lang-text');
    
    // Check for saved language preference or default to 'TR'
    const currentLang = localStorage.getItem('language') || 'TR';
    if (langText) {
        langText.textContent = currentLang;
    }

// Language content
const translations = {
    TR: {
        'nav-home': 'Ana Sayfa',
        'nav-about': 'Hakkımda',
        'nav-projects': 'Projeler',
        'nav-skills': 'Yetenekler',
        'nav-services': 'Hizmetler',
        'nav-contact': 'İletişim',
        'hero-title': 'Merhaba, Ben Frontend Developer',
        'hero-description': 'Modern web teknolojileri ile kullanıcı deneyimini ön planda tutan, yaratıcı ve fonksiyonel web uygulamaları geliştiriyorum.',
        'hero-projects': 'Projelerimi Gör',
        'hero-contact': 'İletişime Geç',
        'hero-download': 'CV İndir'
    },
    EN: {
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-projects': 'Projects',
        'nav-skills': 'Skills',
        'nav-services': 'Services',
        'nav-contact': 'Contact',
        'hero-title': 'Hello, I am Frontend Developer',
        'hero-description': 'I develop creative and functional web applications that prioritize user experience with modern web technologies.',
        'hero-projects': 'View Projects',
        'hero-contact': 'Get in Touch',
        'hero-download': 'Download CV'
    }
};

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

    languageToggle.addEventListener('click', () => {
        const currentLang = langText ? langText.textContent : 'TR';
        const newLang = currentLang === 'TR' ? 'EN' : 'TR';
        
        if (langText) {
            langText.textContent = newLang;
        }
        localStorage.setItem('language', newLang);
        
        // Update page content using translation system
        if (typeof updateLanguage === 'function') {
            updateLanguage(newLang);
        }
        
        // Track language change
        if (typeof trackEvent === 'function') {
            trackEvent('language_change', 'ui', newLang.toLowerCase(), 1);
        }
    });
}

// Initialize language on page load
const savedLang = localStorage.getItem('language') || 'TR';
updateLanguage(savedLang);

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.about-card, .skill-category, .project-card, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form submission
const form = document.querySelector('.form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const subject = form.querySelectorAll('input[type="text"]')[1].value;
        const message = form.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Testimonials Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Auto-play testimonials
setInterval(nextTestimonial, 5000);

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// CV Download Feature
const downloadCVBtn = document.getElementById('download-cv');
if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Track download event
        trackDownload('Frontend_Developer_CV.txt');
        
        // Create a simple CV content (in real scenario, you'd have a PDF file)
        const cvContent = `
Frontend Developer CV

Kişisel Bilgiler:
- Ad: Frontend Developer
- Email: developer@example.com
- Telefon: +90 555 123 45 67
- Konum: İstanbul, Türkiye

Deneyim:
- Senior Frontend Developer (2024 - Devam Ediyor)
- Frontend Developer (2022 - 2024)
- Junior Frontend Developer (2021 - 2022)

Yetenekler:
- HTML5, CSS3, JavaScript
- React, Vue.js, Angular
- SASS, Bootstrap
- Git, NPM, Webpack

Eğitim:
- Bilgisayar Mühendisliği (2017 - 2021)
- İstanbul Teknik Üniversitesi

Sertifikalar:
- JavaScript Advanced (Udemy)
- React Development (Coursera)
- Frontend Development (FreeCodeCamp)
- CSS Advanced (MDN Web Docs)
        `;
        
        // Create and download text file
        const blob = new Blob([cvContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Frontend_Developer_CV.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show success message
        const originalText = downloadCVBtn.innerHTML;
        downloadCVBtn.innerHTML = '<i class="fas fa-check"></i> İndirildi!';
        downloadCVBtn.style.background = '#4ecdc4';
        
        setTimeout(() => {
            downloadCVBtn.innerHTML = originalText;
            downloadCVBtn.style.background = '#4ecdc4';
        }, 2000);
    });
}

// Particles.js Configuration
window.addEventListener('load', () => {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#667eea'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#667eea',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
});

// Skill items hover effect
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Project cards tilt effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Performance Optimizations
// Lazy Loading Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

// Preload Critical Resources
function preloadCriticalResources() {
    const criticalImages = [
        'images/hero-bg.svg',
        'images/profile.svg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Optimize Scroll Performance
function optimizeScrollPerformance() {
    let ticking = false;
    
    function updateScrollElements() {
        // Update scroll-based animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Debounce Function for Performance
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

// Throttle Function for Performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize Resize Events
function optimizeResizeEvents() {
    const handleResize = debounce(() => {
        // Handle resize events here
        if (window.innerWidth <= 768) {
            // Mobile optimizations
        } else {
            // Desktop optimizations
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
}

// Google Analytics Event Tracking
function trackEvent(action, category, label, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
}

// Track page views
function trackPageView(pageName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageName,
            page_location: window.location.href
        });
    }
}

// Track button clicks
function trackButtonClick(buttonName, location) {
    trackEvent('click', 'button', `${buttonName}_${location}`, 1);
}

// Track form submissions
function trackFormSubmission(formName) {
    trackEvent('submit', 'form', formName, 1);
}

// Track downloads
function trackDownload(fileName) {
    trackEvent('download', 'file', fileName, 1);
}

// Track external links
function trackExternalLink(url) {
    trackEvent('click', 'external_link', url, 1);
}

// Contact Form API Integration
async function submitContactForm(formData) {
    try {
        const response = await fetch('/api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, data: result };
        } else {
            return { success: false, error: result.error || 'Unknown error occurred' };
        }
    } catch (error) {
        console.error('Form submission error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Enhanced Contact Form Handler
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Track form submission attempt
        trackFormSubmission('contact_form');
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        submitBtn.disabled = true;
        
        try {
            // Submit form
            const result = await submitContactForm(data);
            
            if (result.success) {
                // Success
                contactForm.reset();
                showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.', 'success');
                
                // Track successful submission
                trackEvent('form_success', 'contact', 'message_sent', 1);
            } else {
                // Error
                showNotification(result.error || 'Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
                
                // Track form error
                trackEvent('form_error', 'contact', result.error || 'unknown_error', 1);
            }
        } catch (error) {
            // Network or other error
            showNotification('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.', 'error');
            trackEvent('form_error', 'contact', 'network_error', 1);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        delay: 0,
        anchorPlacement: 'top-bottom',
        disable: function() {
            return window.innerWidth < 768;
        }
    });
}

// Advanced Animation System
class AnimationController {
    constructor() {
        this.observers = [];
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupTextAnimations();
        this.setupParallaxEffects();
        this.setupMagneticElements();
        this.setupLoadingAnimations();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
        
        this.observers.push(observer);
    }
    
    animateElement(element) {
        const animationType = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add(`animate-${animationType}`);
        }, delay);
    }
    
    setupHoverEffects() {
        // 3D Card Effects
        document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
        
        // Magnetic Effect
        document.querySelectorAll('.magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }
    
    setupTextAnimations() {
        // Text Reveal Animation
        document.querySelectorAll('.text-reveal').forEach(element => {
            const text = element.textContent;
            element.innerHTML = text.split('').map(char => 
                `<span style="animation-delay: ${Math.random() * 0.5}s">${char}</span>`
            ).join('');
        });
        
        // Typing Animation
        document.querySelectorAll('.typing-animation').forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid #2563eb';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    element.style.borderRight = 'none';
                }
            };
            
            setTimeout(typeWriter, 1000);
        });
    }
    
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    setupMagneticElements() {
        document.querySelectorAll('.magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }
    
    setupLoadingAnimations() {
        // Page Load Animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Animate hero elements
            setTimeout(() => {
                document.querySelectorAll('.hero-content > *').forEach((el, index) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        el.style.transition = 'all 0.8s ease';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }, 500);
        });
        
        // Loading States
        this.setupButtonLoadingStates();
    }
    
    setupButtonLoadingStates() {
        document.querySelectorAll('button[type="submit"]').forEach(button => {
            button.addEventListener('click', () => {
                if (button.form && button.form.checkValidity()) {
                    button.innerHTML = '<div class="loading-spinner"></div> Yükleniyor...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        button.innerHTML = 'Gönderildi!';
                        button.style.background = '#10b981';
                    }, 2000);
                }
            });
        });
    }
    
    // Utility Methods
    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add(animationClass);
            }, index * delay);
        });
    }
    
    createParticleEffect(element) {
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#2563eb';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.opacity = '0';
            
            element.appendChild(particle);
            particles.push(particle);
            
            // Animate particle
            setTimeout(() => {
                particle.style.transition = 'all 1s ease';
                particle.style.opacity = '1';
                particle.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => particle.remove(), 1000);
                }, 500);
            }, i * 20);
        }
    }
}

// Initialize Advanced Animations
const animationController = new AnimationController();

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }
    
    init() {
        this.measurePageLoad();
        this.measureCoreWebVitals();
        this.setupPerformanceObserver();
    }
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.pageLoadTime = loadTime;
            
            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    value: Math.round(loadTime),
                    event_category: 'Performance'
                });
            }
        });
    }
    
    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'lcp', {
                    value: Math.round(lastEntry.startTime),
                    event_category: 'Core Web Vitals'
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'fid', {
                        value: Math.round(entry.processingStart - entry.startTime),
                        event_category: 'Core Web Vitals'
                    });
                }
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.metrics.cls = clsValue;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cls', {
                    value: Math.round(clsValue * 1000),
                    event_category: 'Core Web Vitals'
                });
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    setupPerformanceObserver() {
        // Monitor resource loading
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'resource') {
                    const loadTime = entry.responseEnd - entry.startTime;
                    if (loadTime > 1000) { // Log slow resources
                        console.warn(`Slow resource: ${entry.name} took ${loadTime}ms`);
                    }
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Initialize Performance Monitoring
const performanceMonitor = new PerformanceMonitor();

// Advanced Caching Strategy
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100;
        this.init();
    }
    
    init() {
        // Cache DOM queries
        this.cacheDOMQueries();
        
        // Setup cache cleanup
        this.setupCacheCleanup();
    }
    
    cacheDOMQueries() {
        const commonSelectors = [
            '.navbar',
            '.hero',
            '.about-card',
            '.project-card',
            '.service-card',
            '.contact-form'
        ];
        
        commonSelectors.forEach(selector => {
            this.set(selector, document.querySelector(selector));
        });
    }
    
    get(key) {
        return this.cache.get(key);
    }
    
    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
    
    setupCacheCleanup() {
        // Clean cache every 5 minutes
        setInterval(() => {
            this.cache.clear();
            this.cacheDOMQueries();
        }, 300000);
    }
}

// Initialize Cache Manager
const cacheManager = new CacheManager();

// Advanced Debouncing and Throttling
class EventOptimizer {
    constructor() {
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
    }
    
    debounce(func, delay, key) {
        const timerKey = key || func.name;
        
        if (this.debounceTimers.has(timerKey)) {
            clearTimeout(this.debounceTimers.get(timerKey));
        }
        
        const timer = setTimeout(() => {
            func();
            this.debounceTimers.delete(timerKey);
        }, delay);
        
        this.debounceTimers.set(timerKey, timer);
    }
    
    throttle(func, delay, key) {
        const timerKey = key || func.name;
        
        if (this.throttleTimers.has(timerKey)) {
            return;
        }
        
        func();
        
        const timer = setTimeout(() => {
            this.throttleTimers.delete(timerKey);
        }, delay);
        
        this.throttleTimers.set(timerKey, timer);
    }
}

// Initialize Event Optimizer
const eventOptimizer = new EventOptimizer();

// Optimize scroll events
const optimizedScrollHandler = eventOptimizer.throttle(() => {
    // Scroll-based animations and effects
    animationController.setupParallaxEffects();
}, 16, 'scroll'); // 60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Optimize resize events
const optimizedResizeHandler = eventOptimizer.debounce(() => {
    // Recalculate layouts and positions
    animationController.setupHoverEffects();
}, 250, 'resize');

window.addEventListener('resize', optimizedResizeHandler);

// PWA (Progressive Web App) Features
class PWAFeatures {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupOfflineDetection();
        this.setupBackgroundSync();
        this.setupPushNotifications();
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Check if we're running on localhost or HTTPS
                const isLocalhost = window.location.hostname === 'localhost' || 
                                   window.location.hostname === '127.0.0.1' ||
                                   window.location.protocol === 'https:';
                
                if (isLocalhost || window.location.protocol === 'https:') {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('Service Worker registered successfully:', registration);
                            
                            // Check for updates
                            registration.addEventListener('updatefound', () => {
                                const newWorker = registration.installing;
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        this.showUpdateNotification();
                                    }
                                });
                            });
                        })
                        .catch(error => {
                            console.error('Service Worker registration failed:', error);
                        });
                } else {
                    console.log('Service Worker not supported on this protocol:', window.location.protocol);
                }
            });
        }
    }
    
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA: Install prompt triggered');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('PWA: App installed successfully');
            this.deferredPrompt = null;
            this.hideInstallButton();
            
            // Track installation
            if (typeof trackEvent === 'function') {
                trackEvent('pwa_install', 'engagement', 'app_installed', 1);
            }
        });
    }
    
    showInstallButton() {
        // Create install button if it doesn't exist
        if (!document.getElementById('pwa-install-btn')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'btn btn-primary pwa-install-btn';
            installBtn.innerHTML = '<i class="fas fa-download"></i> Uygulamayı Yükle';
            installBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                animation: bounceIn 1s ease-out;
            `;
            
            installBtn.addEventListener('click', () => {
                this.installApp();
            });
            
            document.body.appendChild(installBtn);
        }
    }
    
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }
    
    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`PWA: User choice: ${outcome}`);
            this.deferredPrompt = null;
        }
    }
    
    setupOfflineDetection() {
        const updateOnlineStatus = () => {
            const isOnline = navigator.onLine;
            this.showOfflineStatus(!isOnline);
            
            if (typeof trackEvent === 'function') {
                trackEvent('connection_change', 'system', isOnline ? 'online' : 'offline', 1);
            }
        };
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        // Initial check
        updateOnlineStatus();
    }
    
    showOfflineStatus(isOffline) {
        if (isOffline) {
            if (!document.getElementById('offline-indicator')) {
                const indicator = document.createElement('div');
                indicator.id = 'offline-indicator';
                indicator.innerHTML = '<i class="fas fa-wifi"></i> Çevrimdışı Mod';
                indicator.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #f59e0b;
                    color: white;
                    text-align: center;
                    padding: 10px;
                    z-index: 10000;
                    animation: slideInFromTop 0.5s ease-out;
                `;
                document.body.appendChild(indicator);
            }
        } else {
            const indicator = document.getElementById('offline-indicator');
            if (indicator) {
                indicator.remove();
            }
        }
    }
    
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            // Register for background sync
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('contact-form-sync');
            }).catch(error => {
                console.error('Background sync registration failed:', error);
            });
        }
    }
    
    setupPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            // Request notification permission
            if (Notification.permission === 'default') {
                this.requestNotificationPermission();
            }
        }
    }
    
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('PWA: Notification permission granted');
                
                // Subscribe to push notifications
                this.subscribeToPush();
            } else {
                console.log('PWA: Notification permission denied');
            }
        } catch (error) {
            console.error('PWA: Error requesting notification permission:', error);
        }
    }
    
    async subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            });
            
            console.log('PWA: Push subscription successful:', subscription);
            
            // Send subscription to server
            await fetch('/api/push-subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription)
            });
            
        } catch (error) {
            console.error('PWA: Push subscription failed:', error);
        }
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    showUpdateNotification() {
        if (!document.getElementById('update-notification')) {
            const notification = document.createElement('div');
            notification.id = 'update-notification';
            notification.innerHTML = `
                <div style="background: var(--card-bg); padding: 1rem; border-radius: 10px; box-shadow: var(--shadow-lg); margin: 1rem;">
                    <h4>Güncelleme Mevcut!</h4>
                    <p>Yeni özellikler ve iyileştirmeler için uygulamayı güncelleyin.</p>
                    <button onclick="location.reload()" class="btn btn-primary">Güncelle</button>
                    <button onclick="this.parentElement.parentElement.remove()" class="btn btn-secondary">Daha Sonra</button>
                </div>
            `;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                max-width: 400px;
                animation: bounceIn 1s ease-out;
            `;
            document.body.appendChild(notification);
        }
    }
    
    // Utility methods
    isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }
    
    getPWAInfo() {
        return {
            isInstalled: this.isPWAInstalled(),
            isOnline: navigator.onLine,
            hasServiceWorker: 'serviceWorker' in navigator,
            hasNotifications: 'Notification' in window,
            hasBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
        };
    }
}

// Initialize PWA Features
const pwaFeatures = new PWAFeatures();

// Advanced Contact Form System
class AdvancedContactForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.init();
    }
    
    init() {
        this.setupFormElements();
        this.setupEventListeners();
        this.updateProgress();
        this.setupValidation();
        this.setupFileUpload();
        this.setupCharacterCount();
    }
    
    setupFormElements() {
        this.form = document.getElementById('contact-form-advanced');
        this.steps = document.querySelectorAll('.form-step');
        this.stepContents = document.querySelectorAll('.form-step-content');
        this.progressBar = document.getElementById('form-progress-bar');
        this.nextBtn = document.getElementById('form-next');
        this.prevBtn = document.getElementById('form-prev');
        this.submitBtn = document.getElementById('form-submit');
        this.resetBtn = document.getElementById('form-reset');
        this.summaryContent = document.getElementById('form-summary-content');
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.prevBtn.addEventListener('click', () => this.prevStep());
        this.submitBtn.addEventListener('click', (e) => this.submitForm(e));
        this.resetBtn.addEventListener('click', () => this.resetForm());
        
        // Form inputs
        this.form.addEventListener('input', (e) => this.handleInput(e));
        this.form.addEventListener('change', (e) => this.handleInput(e));
        
        // Step navigation
        this.steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                if (index + 1 <= this.currentStep) {
                    this.goToStep(index + 1);
                }
            });
        });
    }
    
    setupValidation() {
        this.validators = {
            name: (value) => {
                if (!value.trim()) return 'Ad soyad gereklidir';
                if (value.trim().length < 2) return 'Ad soyad en az 2 karakter olmalıdır';
                return null;
            },
            email: (value) => {
                if (!value.trim()) return 'Email gereklidir';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Geçerli bir email adresi girin';
                return null;
            },
            phone: (value) => {
                if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
                    return 'Geçerli bir telefon numarası girin';
                }
                return null;
            },
            'project-type': (value) => {
                if (!value) return 'Proje türü seçmelisiniz';
                return null;
            },
            message: (value) => {
                if (!value.trim()) return 'Proje detayları gereklidir';
                if (value.trim().length < 10) return 'Proje detayları en az 10 karakter olmalıdır';
                return null;
            },
            privacy: (value) => {
                if (!value) return 'Gizlilik politikasını kabul etmelisiniz';
                return null;
            }
        };
    }
    
    setupFileUpload() {
        const fileInput = document.getElementById('file-upload');
        const fileLabel = document.getElementById('file-label');
        
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                fileLabel.classList.add('has-file');
                fileLabel.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>${files.length} dosya seçildi</span>
                `;
            } else {
                fileLabel.classList.remove('has-file');
                fileLabel.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>Dosya yüklemek için tıklayın veya sürükleyin</span>
                `;
            }
        });
        
        // Drag and drop
        fileLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileLabel.style.borderColor = 'var(--primary-color)';
        });
        
        fileLabel.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileLabel.style.borderColor = 'var(--border-color)';
        });
        
        fileLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            fileLabel.style.borderColor = 'var(--border-color)';
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        });
    }
    
    setupCharacterCount() {
        const messageTextarea = document.getElementById('message');
        const countElement = document.getElementById('message-count');
        
        messageTextarea.addEventListener('input', (e) => {
            const length = e.target.value.length;
            countElement.textContent = `${length} / 1000`;
            
            if (length > 800) {
                countElement.classList.add('warning');
            } else if (length > 950) {
                countElement.classList.add('error');
            } else {
                countElement.classList.remove('warning', 'error');
            }
        });
    }
    
    handleInput(e) {
        const field = e.target;
        const fieldName = field.name;
        const value = field.type === 'checkbox' ? field.checked : field.value;
        
        // Store form data
        this.formData[fieldName] = value;
        
        // Validate field
        this.validateField(field);
        
        // Update progress
        this.updateProgress();
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.type === 'checkbox' ? field.checked : field.value;
        const validator = this.validators[fieldName];
        
        if (validator) {
            const error = validator(value);
            this.showFieldError(field, error);
        }
    }
    
    showFieldError(field, error) {
        const errorElement = document.getElementById(`${field.name}-error`);
        
        if (error) {
            field.classList.add('error');
            field.classList.remove('success');
            if (errorElement) {
                errorElement.textContent = error;
                errorElement.classList.add('show');
            }
        } else {
            field.classList.remove('error');
            field.classList.add('success');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }
    }
    
    validateCurrentStep() {
        const currentStepContent = document.querySelector(`[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepContent.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            this.validateField(field);
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement && errorElement.classList.contains('show')) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.updateProgress();
                this.updateButtons();
                
                // Generate summary on last step
                if (this.currentStep === this.totalSteps) {
                    this.generateSummary();
                }
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgress();
            this.updateButtons();
        }
    }
    
    goToStep(step) {
        if (step >= 1 && step <= this.totalSteps) {
            this.currentStep = step;
            this.updateStepDisplay();
            this.updateProgress();
            this.updateButtons();
        }
    }
    
    updateStepDisplay() {
        // Hide all step contents
        this.stepContents.forEach(content => {
            content.style.display = 'none';
        });
        
        // Show current step content
        const currentContent = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (currentContent) {
            currentContent.style.display = 'block';
        }
        
        // Update step indicators
        this.steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });
    }
    
    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    updateButtons() {
        // Previous button
        this.prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        
        // Next/Submit button
        if (this.currentStep < this.totalSteps) {
            this.nextBtn.style.display = 'block';
            this.submitBtn.style.display = 'none';
        } else {
            this.nextBtn.style.display = 'none';
            this.submitBtn.style.display = 'block';
        }
    }
    
    generateSummary() {
        const summaryHTML = `
            <div class="summary-item">
                <strong>Ad Soyad:</strong> ${this.formData.name || 'Belirtilmemiş'}
            </div>
            <div class="summary-item">
                <strong>Email:</strong> ${this.formData.email || 'Belirtilmemiş'}
            </div>
            <div class="summary-item">
                <strong>Telefon:</strong> ${this.formData.phone || 'Belirtilmemiş'}
            </div>
            <div class="summary-item">
                <strong>Şirket:</strong> ${this.formData.company || 'Belirtilmemiş'}
            </div>
            <div class="summary-item">
                <strong>Proje Türü:</strong> ${this.getProjectTypeLabel(this.formData.project_type)}
            </div>
            <div class="summary-item">
                <strong>Bütçe:</strong> ${this.getBudgetLabel(this.formData.budget)}
            </div>
            <div class="summary-item">
                <strong>Zaman Çizelgesi:</strong> ${this.getTimelineLabel(this.formData.timeline)}
            </div>
            <div class="summary-item">
                <strong>İletişim Yöntemi:</strong> ${this.getContactMethodLabel(this.formData.preferred_contact)}
            </div>
        `;
        
        this.summaryContent.innerHTML = summaryHTML;
    }
    
    getProjectTypeLabel(value) {
        const labels = {
            'website': 'Kurumsal Website',
            'ecommerce': 'E-ticaret Sitesi',
            'webapp': 'Web Uygulaması',
            'mobile': 'Mobil Uygulama',
            'dashboard': 'Dashboard/Admin Panel',
            'other': 'Diğer'
        };
        return labels[value] || 'Belirtilmemiş';
    }
    
    getBudgetLabel(value) {
        const labels = {
            '5000-10000': '5.000 - 10.000 TL',
            '10000-25000': '10.000 - 25.000 TL',
            '25000-50000': '25.000 - 50.000 TL',
            '50000+': '50.000 TL+'
        };
        return labels[value] || 'Belirtilmemiş';
    }
    
    getTimelineLabel(value) {
        const labels = {
            '1-month': '1 ay',
            '2-3-months': '2-3 ay',
            '3-6-months': '3-6 ay',
            '6-months+': '6 ay+'
        };
        return labels[value] || 'Belirtilmemiş';
    }
    
    getContactMethodLabel(value) {
        const labels = {
            'email': 'Email',
            'phone': 'Telefon',
            'whatsapp': 'WhatsApp',
            'video-call': 'Video Görüşme'
        };
        return labels[value] || 'Email';
    }
    
    async submitForm(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Show loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
        
        try {
            // Prepare form data
            const formData = new FormData();
            
            // Add all form data
            Object.keys(this.formData).forEach(key => {
                if (this.formData[key] !== undefined && this.formData[key] !== '') {
                    formData.append(key, this.formData[key]);
                }
            });
            
            // Add files
            const fileInput = document.getElementById('file-upload');
            if (fileInput.files.length > 0) {
                Array.from(fileInput.files).forEach(file => {
                    formData.append('files[]', file);
                });
            }
            
            // Submit form
            const response = await fetch('/api/contact.php', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                this.showSuccessMessage();
                this.resetForm();
                
                // Track form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'engagement',
                        event_label: 'contact_form',
                        value: 1
                    });
                }
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    showSuccessMessage() {
        this.showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.', 'success');
    }
    
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    resetForm() {
        this.currentStep = 1;
        this.formData = {};
        this.form.reset();
        
        // Reset all field states
        document.querySelectorAll('.form-input-advanced').forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        document.querySelectorAll('.form-error-message').forEach(error => {
            error.classList.remove('show');
        });
        
        // Reset file upload
        const fileLabel = document.getElementById('file-label');
        fileLabel.classList.remove('has-file');
        fileLabel.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Dosya yüklemek için tıklayın veya sürükleyin</span>
        `;
        
        // Reset character count
        const countElement = document.getElementById('message-count');
        countElement.textContent = '0 / 1000';
        countElement.classList.remove('warning', 'error');
        
        this.updateStepDisplay();
        this.updateProgress();
        this.updateButtons();
    }
}

// Initialize Advanced Contact Form
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contact-form-advanced')) {
        new AdvancedContactForm();
    }
});

// Security Headers and CSP Monitoring
class SecurityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCSPMonitoring();
        this.setupSecurityHeaders();
        this.setupContentProtection();
        this.setupFormSecurity();
        this.setupXSSProtection();
    }
    
    setupCSPMonitoring() {
        // Monitor Content Security Policy violations
        document.addEventListener('securitypolicyviolation', (e) => {
            console.warn('CSP Violation:', {
                blockedURI: e.blockedURI,
                violatedDirective: e.violatedDirective,
                originalPolicy: e.originalPolicy,
                sourceFile: e.sourceFile,
                lineNumber: e.lineNumber
            });
            
            // Report to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'csp_violation', {
                    event_category: 'security',
                    event_label: e.violatedDirective,
                    value: 1
                });
            }
        });
    }
    
    setupSecurityHeaders() {
        // Check if security headers are present
        this.checkSecurityHeaders();
        
        // Monitor for suspicious activities
        this.setupActivityMonitoring();
    }
    
    checkSecurityHeaders() {
        const headers = {
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000'
        };
        
        // Log security header status
        console.log('Security Headers Status:', headers);
    }
    
    setupActivityMonitoring() {
        // Monitor for suspicious mouse movements (potential bot detection)
        let mouseMovements = 0;
        let lastMouseTime = Date.now();
        
        document.addEventListener('mousemove', () => {
            mouseMovements++;
            lastMouseTime = Date.now();
        });
        
        // Monitor for rapid clicks (potential automated attacks)
        let clickCount = 0;
        let clickStartTime = Date.now();
        
        document.addEventListener('click', (e) => {
            clickCount++;
            const now = Date.now();
            
            if (now - clickStartTime < 1000 && clickCount > 10) {
                console.warn('Suspicious rapid clicking detected');
                this.reportSuspiciousActivity('rapid_clicking', {
                    clicks: clickCount,
                    timeWindow: now - clickStartTime
                });
            }
            
            if (now - clickStartTime > 1000) {
                clickCount = 1;
                clickStartTime = now;
            }
        });
        
        // Monitor for keyboard patterns (potential automated input)
        let keyPatterns = [];
        document.addEventListener('keydown', (e) => {
            keyPatterns.push({
                key: e.key,
                timestamp: Date.now(),
                target: e.target.tagName
            });
            
            // Keep only last 50 keystrokes
            if (keyPatterns.length > 50) {
                keyPatterns = keyPatterns.slice(-50);
            }
            
            // Detect rapid typing patterns
            if (keyPatterns.length > 10) {
                const recentKeys = keyPatterns.slice(-10);
                const timeSpan = recentKeys[recentKeys.length - 1].timestamp - recentKeys[0].timestamp;
                
                if (timeSpan < 1000) { // Less than 1 second for 10 keystrokes
                    console.warn('Suspicious rapid typing detected');
                    this.reportSuspiciousActivity('rapid_typing', {
                        keystrokes: recentKeys.length,
                        timeSpan: timeSpan
                    });
                }
            }
        });
    }
    
    setupContentProtection() {
        // Disable right-click context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showProtectionMessage('İçerik koruması aktif');
        });
        
        // Disable text selection on sensitive content
        document.addEventListener('selectstart', (e) => {
            if (e.target.classList.contains('protected-content')) {
                e.preventDefault();
            }
        });
        
        // Disable drag and drop
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('protected-content')) {
                e.preventDefault();
            }
        });
        
        // Disable F12, Ctrl+Shift+I, Ctrl+U
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                this.showProtectionMessage('Geliştirici araçları devre dışı');
            }
        });
    }
    
    setupFormSecurity() {
        // Add CSRF protection to forms
        document.querySelectorAll('form').forEach(form => {
            if (!form.querySelector('input[name="csrf_token"]')) {
                const csrfToken = this.generateCSRFToken();
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
            }
        });
        
        // Add honeypot fields to prevent bots
        document.querySelectorAll('form').forEach(form => {
            if (!form.querySelector('input[name="website"]')) {
                const honeypot = document.createElement('input');
                honeypot.type = 'text';
                honeypot.name = 'website';
                honeypot.style.display = 'none';
                honeypot.style.position = 'absolute';
                honeypot.style.left = '-9999px';
                honeypot.setAttribute('tabindex', '-1');
                honeypot.setAttribute('autocomplete', 'off');
                form.appendChild(honeypot);
            }
        });
    }
    
    setupXSSProtection() {
        // Sanitize user input
        this.sanitizeInputs();
        
        // Monitor for XSS attempts
        this.monitorXSSAttempts();
    }
    
    sanitizeInputs() {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // Check for potential XSS patterns
                const xssPatterns = [
                    /<script/i,
                    /javascript:/i,
                    /on\w+\s*=/i,
                    /<iframe/i,
                    /<object/i,
                    /<embed/i,
                    /<link/i,
                    /<meta/i
                ];
                
                if (xssPatterns.some(pattern => pattern.test(value))) {
                    console.warn('Potential XSS attempt detected');
                    this.reportSuspiciousActivity('xss_attempt', {
                        input: input.name,
                        value: value.substring(0, 100) // Limit logged value
                    });
                }
            });
        });
    }
    
    monitorXSSAttempts() {
        // Monitor URL parameters for XSS attempts
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            const xssPatterns = [
                /<script/i,
                /javascript:/i,
                /on\w+\s*=/i
            ];
            
            if (xssPatterns.some(pattern => pattern.test(value))) {
                console.warn('XSS attempt in URL parameters');
                this.reportSuspiciousActivity('url_xss_attempt', {
                    parameter: key,
                    value: value.substring(0, 100)
                });
            }
        });
    }
    
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    reportSuspiciousActivity(type, data) {
        console.warn('Suspicious activity detected:', type, data);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'security_alert', {
                event_category: 'security',
                event_label: type,
                value: 1
            });
        }
        
        // Store locally for analysis
        const securityLog = JSON.parse(localStorage.getItem('security_log') || '[]');
        securityLog.push({
            timestamp: new Date().toISOString(),
            type: type,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        // Keep only last 50 entries
        if (securityLog.length > 50) {
            securityLog.splice(0, securityLog.length - 50);
        }
        
        localStorage.setItem('security_log', JSON.stringify(securityLog));
    }
    
    showProtectionMessage(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // Public methods for external security checks
    validateInput(input, type = 'text') {
        const validators = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\+]?[0-9\s\-\(\)]{10,}$/,
            url: /^https?:\/\/.+/,
            text: /^[a-zA-Z0-9\s\-_.,!?]+$/
        };
        
        return validators[type] ? validators[type].test(input) : true;
    }
    
    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
    
    getSecurityReport() {
        return {
            headers: this.checkSecurityHeaders(),
            violations: JSON.parse(localStorage.getItem('security_log') || '[]'),
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize Security Manager
const securityManager = new SecurityManager();

// Advanced SEO Optimization
class SEOOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupStructuredData();
        this.setupMetaOptimization();
        this.setupPerformanceTracking();
        this.setupUserEngagement();
        this.setupContentOptimization();
        this.setupSocialSharing();
    }
    
    setupStructuredData() {
        // Add dynamic structured data based on page content
        this.addBreadcrumbSchema();
        this.addArticleSchema();
        this.addFAQSchema();
        this.addReviewSchema();
    }
    
    addBreadcrumbSchema() {
        const breadcrumbs = [
            { name: "Ana Sayfa", url: "https://devportfolio.com/" },
            { name: "Hakkımda", url: "https://devportfolio.com/about.html" },
            { name: "Projeler", url: "https://devportfolio.com/projects.html" },
            { name: "Hizmetler", url: "https://devportfolio.com/services.html" },
            { name: "Blog", url: "https://devportfolio.com/blog.html" },
            { name: "İletişim", url: "https://devportfolio.com/contact.html" }
        ];
        
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };
        
        this.injectSchema(breadcrumbSchema);
    }
    
    addArticleSchema() {
        // Add article schema for blog posts
        const articles = document.querySelectorAll('article, .blog-post');
        articles.forEach((article, index) => {
            const title = article.querySelector('h1, h2, h3')?.textContent;
            const content = article.textContent.substring(0, 500);
            const date = article.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();
            
            if (title) {
                const articleSchema = {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": title,
                    "description": content,
                    "datePublished": date,
                    "author": {
                        "@type": "Person",
                        "name": "Frontend Developer"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "DevPortfolio"
                    }
                };
                
                this.injectSchema(articleSchema);
            }
        });
    }
    
    addFAQSchema() {
        // Add FAQ schema for common questions
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Hangi teknolojileri kullanıyorsunuz?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "React, Vue.js, JavaScript, HTML5, CSS3 ve modern web teknolojileri kullanıyorum."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Proje süresi ne kadar?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Proje karmaşıklığına göre 1-6 ay arasında değişmektedir."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Responsive tasarım yapıyor musunuz?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Evet, tüm projelerimde mobile-first yaklaşımı ile responsive tasarım uyguluyorum."
                    }
                }
            ]
        };
        
        this.injectSchema(faqSchema);
    }
    
    addReviewSchema() {
        // Add review schema for testimonials
        const reviews = document.querySelectorAll('.testimonial, .review');
        if (reviews.length > 0) {
            const reviewSchema = {
                "@context": "https://schema.org",
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": reviews.length,
                "bestRating": "5",
                "worstRating": "1"
            };
            
            this.injectSchema(reviewSchema);
        }
    }
    
    injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }
    
    setupMetaOptimization() {
        // Optimize meta tags dynamically
        this.updateMetaTags();
        this.addCanonicalLinks();
        this.optimizeImages();
    }
    
    updateMetaTags() {
        // Update meta description based on page content
        const pageContent = document.body.textContent.substring(0, 300);
        const metaDescription = document.querySelector('meta[name="description"]');
        
        if (metaDescription && pageContent.length > 50) {
            const optimizedDescription = pageContent.replace(/\s+/g, ' ').trim().substring(0, 155);
            metaDescription.setAttribute('content', optimizedDescription);
        }
        
        // Add dynamic keywords
        this.addDynamicKeywords();
    }
    
    addDynamicKeywords() {
        const keywords = this.extractKeywords();
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        
        if (metaKeywords && keywords.length > 0) {
            const currentKeywords = metaKeywords.getAttribute('content');
            const newKeywords = [...new Set([...currentKeywords.split(', '), ...keywords])].join(', ');
            metaKeywords.setAttribute('content', newKeywords);
        }
    }
    
    extractKeywords() {
        const keywords = [];
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach(heading => {
            const text = heading.textContent.toLowerCase();
            if (text.includes('react')) keywords.push('react development');
            if (text.includes('vue')) keywords.push('vue.js development');
            if (text.includes('javascript')) keywords.push('javascript development');
            if (text.includes('responsive')) keywords.push('responsive design');
            if (text.includes('web')) keywords.push('web development');
        });
        
        return keywords;
    }
    
    addCanonicalLinks() {
        // Ensure canonical links are present
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.href;
            document.head.appendChild(canonical);
        }
    }
    
    optimizeImages() {
        // Add alt attributes to images without them
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            const altText = this.generateAltText(img);
            img.setAttribute('alt', altText);
        });
        
        // Add loading="lazy" to images below the fold
        const imagesBelowFold = document.querySelectorAll('img:not([loading])');
        imagesBelowFold.forEach((img, index) => {
            if (index > 2) { // Skip first few images
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    generateAltText(img) {
        const src = img.src.toLowerCase();
        const className = img.className.toLowerCase();
        
        if (src.includes('logo')) return 'Logo';
        if (src.includes('profile')) return 'Profil fotoğrafı';
        if (src.includes('project')) return 'Proje görseli';
        if (src.includes('hero')) return 'Ana sayfa görseli';
        if (className.includes('icon')) return 'İkon';
        
        return 'Görsel';
    }
    
    setupPerformanceTracking() {
        // Track Core Web Vitals
        this.trackCoreWebVitals();
        
        // Track user engagement
        this.trackUserEngagement();
    }
    
    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                    event_category: 'Performance',
                    event_label: 'LCP',
                    value: Math.round(lastEntry.startTime),
                    non_interaction: true
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        event_category: 'Performance',
                        event_label: 'FID',
                        value: Math.round(entry.processingStart - entry.startTime),
                        non_interaction: true
                    });
                }
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                    event_category: 'Performance',
                    event_label: 'CLS',
                    value: Math.round(clsValue * 1000),
                    non_interaction: true
                });
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    trackUserEngagement() {
        let scrollDepth = 0;
        let timeOnPage = 0;
        const startTime = Date.now();
        
        // Track scroll depth
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > scrollDepth) {
                scrollDepth = scrollPercent;
                
                // Track milestone scroll depths
                if ([25, 50, 75, 100].includes(scrollDepth)) {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            event_category: 'Engagement',
                            event_label: `${scrollDepth}%`,
                            value: scrollDepth,
                            non_interaction: true
                        });
                    }
                }
            }
        });
        
        // Track time on page
        setInterval(() => {
            timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            // Track milestone time periods
            if ([30, 60, 120, 300].includes(timeOnPage)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        event_category: 'Engagement',
                        event_label: `${timeOnPage}s`,
                        value: timeOnPage,
                        non_interaction: true
                    });
                }
            }
        }, 1000);
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_hidden', {
                        event_category: 'Engagement',
                        event_label: 'Page Hidden',
                        value: timeOnPage,
                        non_interaction: true
                    });
                }
            }
        });
    }
    
    setupUserEngagement() {
        // Track clicks on important elements
        this.trackImportantClicks();
        
        // Track form interactions
        this.trackFormInteractions();
    }
    
    trackImportantClicks() {
        const importantElements = document.querySelectorAll('a[href^="http"], button, .btn, .nav-link');
        
        importantElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const elementType = e.target.tagName.toLowerCase();
                const elementText = e.target.textContent.trim().substring(0, 50);
                const elementHref = e.target.href || '';
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'Engagement',
                        event_label: `${elementType}: ${elementText}`,
                        value: 1
                    });
                }
            });
        });
    }
    
    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Track form start
            form.addEventListener('focusin', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_start', {
                        event_category: 'Engagement',
                        event_label: 'Form Interaction',
                        value: 1,
                        non_interaction: true
                    });
                }
            });
            
            // Track form submission
            form.addEventListener('submit', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'Engagement',
                        event_label: 'Form Submission',
                        value: 1
                    });
                }
            });
        });
    }
    
    setupContentOptimization() {
        // Optimize headings structure
        this.optimizeHeadings();
        
        // Add internal linking
        this.addInternalLinks();
        
        // Optimize content readability
        this.optimizeReadability();
    }
    
    optimizeHeadings() {
        // Ensure proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let currentLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (level > currentLevel + 1) {
                console.warn(`Heading hierarchy issue: ${heading.tagName} after h${currentLevel}`);
            }
            
            currentLevel = level;
        });
    }
    
    addInternalLinks() {
        // Add internal links to related content
        const contentKeywords = this.extractKeywords();
        const links = document.querySelectorAll('a[href^="/"], a[href*="devportfolio.com"]');
        
        // Track internal link clicks
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'internal_link_click', {
                        event_category: 'Navigation',
                        event_label: link.href,
                        value: 1
                    });
                }
            });
        });
    }
    
    optimizeReadability() {
        // Add reading time estimation
        const content = document.body.textContent;
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        // Add reading time indicator if not present
        if (!document.querySelector('.reading-time')) {
            const readingTimeElement = document.createElement('div');
            readingTimeElement.className = 'reading-time';
            readingTimeElement.textContent = `Okuma süresi: ${readingTime} dakika`;
            readingTimeElement.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                opacity: 0.7;
            `;
            document.body.appendChild(readingTimeElement);
        }
    }
    
    setupSocialSharing() {
        // Add social sharing buttons
        this.addSocialSharingButtons();
        
        // Track social sharing
        this.trackSocialSharing();
    }
    
    addSocialSharingButtons() {
        const shareButtons = document.createElement('div');
        shareButtons.className = 'social-share-buttons';
        shareButtons.innerHTML = `
            <button class="share-btn share-twitter" data-platform="twitter">
                <i class="fab fa-twitter"></i> Twitter
            </button>
            <button class="share-btn share-linkedin" data-platform="linkedin">
                <i class="fab fa-linkedin"></i> LinkedIn
            </button>
            <button class="share-btn share-facebook" data-platform="facebook">
                <i class="fab fa-facebook"></i> Facebook
            </button>
        `;
        
        shareButtons.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        `;
        
        // Add click handlers
        shareButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('share-btn')) {
                const platform = e.target.dataset.platform;
                this.shareOnSocial(platform);
            }
        });
        
        document.body.appendChild(shareButtons);
    }
    
    shareOnSocial(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const description = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
        
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            
            // Track social sharing
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_share', {
                    event_category: 'Social',
                    event_label: platform,
                    value: 1
                });
            }
        }
    }
    
    trackSocialSharing() {
        // Track when user returns from social sharing
        window.addEventListener('focus', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'return_from_share', {
                    event_category: 'Social',
                    event_label: 'Return from Share',
                    value: 1,
                    non_interaction: true
                });
            }
        });
    }
    
    // Public methods
    getSEOReport() {
        return {
            metaTags: this.analyzeMetaTags(),
            structuredData: this.analyzeStructuredData(),
            performance: this.analyzePerformance(),
            engagement: this.analyzeEngagement(),
            timestamp: new Date().toISOString()
        };
    }
    
    analyzeMetaTags() {
        const metaTags = {};
        document.querySelectorAll('meta').forEach(meta => {
            const name = meta.getAttribute('name') || meta.getAttribute('property');
            if (name) {
                metaTags[name] = meta.getAttribute('content');
            }
        });
        return metaTags;
    }
    
    analyzeStructuredData() {
        const schemas = [];
        document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
            try {
                schemas.push(JSON.parse(script.textContent));
            } catch (e) {
                console.warn('Invalid JSON-LD schema:', e);
            }
        });
        return schemas;
    }
    
    analyzePerformance() {
        return {
            loadTime: performance.now(),
            domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd || 0,
            firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
        };
    }
    
    analyzeEngagement() {
        return {
            scrollDepth: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100),
            timeOnPage: Math.round((Date.now() - performance.now()) / 1000),
            clicks: document.querySelectorAll('*').length // Simplified click tracking
        };
    }
}

// Initialize SEO Optimizer
const seoOptimizer = new SEOOptimizer();

// Initialize Performance Optimizations
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    preloadCriticalResources();
    optimizeScrollPerformance();
    optimizeResizeEvents();
    initializeAOS();
    initializeContactForm();
});
