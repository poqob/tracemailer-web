/**
 * TraceMailer Landing Page Logic & Alpine.js Controller
 * Cached with Cache-Control: immutable, max-age=31536000
 */
function landingApp() {
    return {
        currentLang: (typeof window !== 'undefined' && window.location && (window.location.pathname === '/en' || window.location.pathname.startsWith('/en/'))) ? 'en' : 'tr',
        langMenuOpen: false,
        mobileMenuOpen: false,
        isMobile: false,
        typewriterText: '',
        fullHeadline: '',
        charIndex: 0,
        typingComplete: false,
        typingTimeout: null,
        plans: [],
        formStatus: 'idle',
        formData: {
            name: '',
            email: '',
            countryCode: '+90',
            phone: '',
            message: ''
        },

        init() {
            // Fetch public plans if any are published by admin
            this.fetchPlans();

            // Detect mobile orientation and screen width
            this.checkMobile();
            window.addEventListener('resize', () => {
                this.checkMobile();
            });

            // Resolve initial language
            if (window.i18n && window.i18n.getLanguage) {
                this.currentLang = window.i18n.getLanguage();
            } else {
                var stored = null;
                try { stored = localStorage.getItem('tracemailer_lang'); } catch(e){}
                if (stored === 'tr' || stored === 'en') {
                    this.currentLang = stored;
                } else {
                    var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
                    this.currentLang = browserLang.startsWith('tr') ? 'tr' : 'en';
                }
            }

            // Sync language with i18n module
            if (window.i18n && window.i18n.setLanguage) {
                window.i18n.setLanguage(this.currentLang);
            }

            // React to external or system language changes
            window.addEventListener('language-changed', (e) => {
                if (e.detail && e.detail.language && (e.detail.language === 'tr' || e.detail.language === 'en')) {
                    this.currentLang = e.detail.language;
                    this.resetTypewriter();
                }
            });

            this.resetTypewriter();
            this.initSliderObserver();
        },

        async fetchPlans() {
            try {
                const res = await fetch('/api/public/plans');
                if (res.ok) {
                    const data = await res.json();
                    this.plans = Array.isArray(data) ? data : [];
                } else {
                    this.plans = [];
                }
            } catch (e) {
                try {
                    const res2 = await fetch('https://dash.tracemailer.com/api/public/plans');
                    if (res2.ok) {
                        const data2 = await res2.json();
                        this.plans = Array.isArray(data2) ? data2 : [];
                    } else {
                        this.plans = [];
                    }
                } catch (err) {
                    this.plans = [];
                }
            }
        },

        checkMobile() {
            this.isMobile = window.innerWidth < 640;
        },

        t(key, params) {
            const _activeLang = this ? this.currentLang : null;
            if (window.i18n && window.i18n.t) {
                const res = window.i18n.t(key, params);
                if (res && res !== key) return res;
            }
            if (key === 'landing.nav.blog' || key === 'landing.footer.blog') {
                return (this && this.currentLang === 'en') ? 'Guides & Blog' : 'Rehber & Blog';
            }
            return key;
        },

        setLang(lang) {
            if (lang !== 'tr' && lang !== 'en') return;
            if (lang === 'en' && !window.location.pathname.startsWith('/en')) {
                window.location.href = '/en/';
                return;
            }
            if (lang === 'tr' && window.location.pathname.startsWith('/en')) {
                window.location.href = '/';
                return;
            }
            if (window.i18n && window.i18n.setLanguage) {
                window.i18n.setLanguage(lang);
            } else {
                try { localStorage.setItem('tracemailer_lang', lang); } catch(e){}
            }
            this.currentLang = lang;
            if (window.Alpine && window.Alpine.store && window.Alpine.store('i18n')) {
                try { window.Alpine.store('i18n').lang = lang; } catch(e){}
            }
            if (document) {
                document.documentElement.lang = lang;
                document.title = this.t('landing.meta.title');
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) {
                    metaDesc.setAttribute('content', this.t('landing.meta.desc'));
                }
            }
            this.resetTypewriter();
        },

        resetTypewriter() {
            if (this.typingTimeout) clearTimeout(this.typingTimeout);
            this.fullHeadline = this.t('landing.hero.headline');
            this.charIndex = 0;
            this.typewriterText = '';
            this.typingComplete = false;
            this.typeOnce();
        },

        typeOnce() {
            if (this.charIndex <= this.fullHeadline.length) {
                this.typewriterText = this.fullHeadline.substring(0, this.charIndex);
                this.charIndex++;
                if (this.charIndex <= this.fullHeadline.length) {
                    this.typingTimeout = setTimeout(() => this.typeOnce(), 35);
                } else {
                    this.typingComplete = true;
                }
            }
        },

        async submitContactForm() {
            this.formStatus = 'loading';
            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.formData)
                });
                if (res.ok) {
                    this.formStatus = 'success';
                    this.formData = { name: '', email: '', countryCode: '+90', phone: '', message: '' };
                } else {
                    this.formStatus = 'error';
                }
            } catch (e) {
                this.formStatus = 'error';
            }
        },

        // Floating Mail Client Icons
        icons: {
            aws: { vx: 0, vy: 0 },
            gmail: { vx: 0, vy: 0 },
            google: { vx: 0, vy: 0 },
            smtp: { vx: 0, vy: 0 },
            mail: { vx: 0, vy: 0 },
            zoho: { vx: 0, vy: 0 },
            icloud: { vx: 0, vy: 0 },
            imap: { vx: 0, vy: 0 },
            thunderbird: { vx: 0, vy: 0 }
        },

        getIconPos(name) {
            const isM = this.isMobile;
            const desktopPos = {
                google:      { x: 48, y: 8 },
                gmail:       { x: 16, y: 18 },
                aws:         { x: 80, y: 16 },
                smtp:        { x: 10, y: 46 },
                mail:        { x: 48, y: 46 },
                zoho:        { x: 84, y: 46 },
                icloud:      { x: 16, y: 76 },
                imap:        { x: 48, y: 84 },
                thunderbird: { x: 80, y: 78 }
            };
            const mobilePos = {
                google:      { x: 50, y: 7 },
                gmail:       { x: 24, y: 18 },
                aws:         { x: 76, y: 19 },
                smtp:        { x: 22, y: 35 },
                mail:        { x: 50, y: 50 },
                zoho:        { x: 78, y: 64 },
                icloud:      { x: 22, y: 72 },
                imap:        { x: 76, y: 84 },
                thunderbird: { x: 50, y: 93 }
            };
            return (isM ? mobilePos[name] : desktopPos[name]) || { x: 50, y: 50 };
        },

        getIconStyle(name) {
            const pos = this.getIconPos(name);
            const vx = (this.icons[name] && this.icons[name].vx) || 0;
            const vy = (this.icons[name] && this.icons[name].vy) || 0;
            return `left: ${pos.x}%; top: ${pos.y}%; transform: translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px));`;
        },

        processPointerMove(mx, my, width, height) {
            Object.keys(this.icons).forEach(k => {
                const pos = this.getIconPos(k);
                const ix = (pos.x / 100) * width;
                const iy = (pos.y / 100) * height;
                const dist = Math.hypot(mx - ix, my - iy);
                const radius = this.isMobile ? 85 : 120;

                if (dist < radius && dist > 0) {
                    const force = (1 - dist / radius) * (this.isMobile ? 22 : 35);
                    const angle = Math.atan2(iy - my, ix - mx);
                    this.icons[k].vx = Math.cos(angle) * force;
                    this.icons[k].vy = Math.sin(angle) * force;
                } else {
                    this.icons[k].vx = 0;
                    this.icons[k].vy = 0;
                }
            });
        },

        handleIconAreaMove(e) {
            const rect = e.currentTarget.getBoundingClientRect();
            this.processPointerMove(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
        },

        handleTouchAreaMove(e) {
            if (e.touches && e.touches.length > 0) {
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                this.processPointerMove(touch.clientX - rect.left, touch.clientY - rect.top, rect.width, rect.height);
            }
        },

        resetIcons() {
            Object.keys(this.icons).forEach(k => {
                this.icons[k].vx = 0;
                this.icons[k].vy = 0;
            });
        },

        // Carousel Slider
        currentSlide: 0,
        sliderPaused: false,
        sliderInterval: null,
        sliderTriggered: false,
        sliderTimeout: null,
        slides: [
            {
                image: '/static/process-diagram.jpg',
                isOverview: true
            },
            {
                image: '/static/screenshots/ai-audience-health.png',
                step: 1,
                badgeKey: 'landing.how.slide1_badge',
                titleKey: 'landing.how.slide1_title',
                descKey: 'landing.how.slide1_desc',
                highlightKey: 'landing.how.slide1_highlight'
            },
            {
                image: '/static/screenshots/ai-send-time-simulator.png',
                step: 2,
                badgeKey: 'landing.how.slide2_badge',
                titleKey: 'landing.how.slide2_title',
                descKey: 'landing.how.slide2_desc',
                highlightKey: 'landing.how.slide2_highlight'
            },
            {
                image: '/static/screenshots/report-dispatch-distribution.png',
                step: 3,
                badgeKey: 'landing.how.slide3_badge',
                titleKey: 'landing.how.slide3_title',
                descKey: 'landing.how.slide3_desc',
                highlightKey: 'landing.how.slide3_highlight'
            },
            {
                image: '/static/screenshots/report-timeline-engagement.png',
                step: 4,
                badgeKey: 'landing.how.slide4_badge',
                titleKey: 'landing.how.slide4_title',
                descKey: 'landing.how.slide4_desc',
                highlightKey: 'landing.how.slide4_highlight'
            },
            {
                image: '/static/screenshots/report-client-device.png',
                step: 5,
                badgeKey: 'landing.how.slide5_badge',
                titleKey: 'landing.how.slide5_title',
                descKey: 'landing.how.slide5_desc',
                highlightKey: 'landing.how.slide5_highlight'
            }
        ],

        initSliderObserver() {
            const target = document.getElementById('how-it-works');
            if (!target) return;

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting && !this.sliderTriggered) {
                        this.startSliderAfterDelay();
                        observer.disconnect();
                    }
                }, { threshold: 0.2 });
                observer.observe(target);
            } else {
                const onScroll = () => {
                    const rect = target.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0 && !this.sliderTriggered) {
                        window.removeEventListener('scroll', onScroll);
                        this.startSliderAfterDelay();
                    }
                };
                window.addEventListener('scroll', onScroll, { passive: true });
                onScroll();
            }
        },

        startSliderAfterDelay() {
            if (this.sliderTriggered) return;
            this.sliderTriggered = true;
            if (this.sliderTimeout) clearTimeout(this.sliderTimeout);
            this.sliderTimeout = setTimeout(() => {
                if (!this.sliderPaused) {
                    this.nextSlide();
                }
                this.initSlider();
            }, 5000);
        },

        initSlider() {
            if (this.sliderInterval) clearInterval(this.sliderInterval);
            this.sliderInterval = setInterval(() => {
                if (!this.sliderPaused) {
                    this.nextSlide();
                }
            }, 5000);
        },

        nextSlide() {
            if (this.sliderTimeout && !this.sliderInterval) {
                clearTimeout(this.sliderTimeout);
                this.initSlider();
            }
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        },

        prevSlide() {
            if (this.sliderTimeout && !this.sliderInterval) {
                clearTimeout(this.sliderTimeout);
                this.initSlider();
            }
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        },

        setSlide(idx) {
            if (this.sliderTimeout && !this.sliderInterval) {
                clearTimeout(this.sliderTimeout);
                this.initSlider();
            }
            this.currentSlide = idx;
        }
    };
}
