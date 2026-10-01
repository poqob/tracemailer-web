// TraceMailer Theme Management System (Light / Dark / System Auto)
(function () {
    var STORAGE_KEY = 'tracemailer_theme';

    // Configure Tailwind Play CDN for class-based dark mode
    if (window.tailwind) {
        window.tailwind.config = window.tailwind.config || {};
        window.tailwind.config.darkMode = 'class';
    } else {
        window.tailwind = {
            config: {
                darkMode: 'class'
            }
        };
    }

    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'system';
        } catch (e) {
            return 'system';
        }
    }

    function isSystemDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function applyTheme(theme) {
        var isDark = false;
        if (theme === 'dark') {
            isDark = true;
        } else if (theme === 'light') {
            isDark = false;
        } else {
            // 'system'
            isDark = isSystemDark();
        }

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Dispatch custom event for reactive UI components (Alpine, etc.)
        try {
            window.dispatchEvent(new CustomEvent('theme-changed', {
                detail: {
                    theme: theme,
                    isDark: isDark
                }
            }));
        } catch (e) {
            // ignore
        }

        return isDark;
    }

    function setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark' && theme !== 'system') {
            theme = 'system';
        }
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // ignore
        }
        return applyTheme(theme);
    }

    // Expose Global API
    window.setTheme = setTheme;
    window.getTheme = getSavedTheme;
    window.isDarkMode = function () {
        return document.documentElement.classList.contains('dark');
    };

    // Initial immediate application
    var initialTheme = getSavedTheme();
    applyTheme(initialTheme);

    // Listen to OS / System preference changes in real-time
    if (window.matchMedia) {
        var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        var handleChange = function () {
            if (getSavedTheme() === 'system') {
                applyTheme('system');
            }
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange);
        }
    }

    // Alpine.js integration helper for theme switcher component
    document.addEventListener('alpine:init', function () {
        if (window.Alpine) {
            window.Alpine.data('themeSwitcher', function () {
                return {
                    theme: getSavedTheme(),
                    isDark: window.isDarkMode(),
                    init: function () {
                        var self = this;
                        window.addEventListener('theme-changed', function (e) {
                            self.theme = e.detail.theme;
                            self.isDark = e.detail.isDark;
                        });
                    },
                    set: function (newTheme) {
                        setTheme(newTheme);
                        this.theme = newTheme;
                        this.isDark = window.isDarkMode();
                    }
                };
            });
        }
    });
})();
