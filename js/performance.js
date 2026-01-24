// js/performance.js
class PerformanceOptimizer {
    static init() {
        this.lazyLoadImages();
        this.preloadCriticalAssets();
        this.setupServiceWorker();
        this.optimizeAnimations();
        this.monitorPerformance();
    }

    static lazyLoadImages() {
        // Defer to ImageLoader class
        if (typeof ImageLoader !== 'undefined') {
            ImageLoader.lazyLoadImages();
        }
    }

    static preloadCriticalAssets() {
        const criticalAssets = [
            { href: '/css/styles.css', as: 'style' },
            { href: '/js/main.js', as: 'script' }
        ];

        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset.href;
            link.as = asset.as;
            
            if (asset.as === 'font') {
                link.crossOrigin = 'anonymous';
            }
            
            document.head.appendChild(link);
        });

        // Preload critical images
        if (typeof ImageLoader !== 'undefined') {
            ImageLoader.preloadCriticalImages();
        }
    }

    static setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
            });
        }
    }

    static optimizeAnimations() {
        // Use will-change for elements that will be animated
        const animatedElements = document.querySelectorAll('.menu-bar, .skyline-container, .hero');
        animatedElements.forEach(el => {
            el.style.willChange = 'opacity, transform';
        });

        // Reduce animations for users who prefer reduced motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) {
            document.documentElement.classList.add('reduced-motion');
        }
        motionQuery.addEventListener('change', () => {
            if (motionQuery.matches) {
                document.documentElement.classList.add('reduced-motion');
            } else {
                document.documentElement.classList.remove('reduced-motion');
            }
        });
    }

    static monitorPerformance() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                    }
                });
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
        }

        // Log page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        });
    }

    static debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const context = this, args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}