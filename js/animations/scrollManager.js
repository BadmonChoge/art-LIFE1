// js/animations/scrollManager.js - Universal Edge Fade for All Pages
// Polished Version with Robust Error Handling

// Global prevention - only allow one instance
if (typeof window.ScrollAnimationManager === 'undefined') {
    
    class ScrollAnimationManager {
        constructor() {
            // Prevent multiple instances
            if (window.ScrollAnimationManagerInstance) {
                console.warn('ScrollAnimationManager already initialized');
                return window.ScrollAnimationManagerInstance;
            }
            
            this.observers = [];
            this.isDesktop = window.innerWidth >= 769;
            this.scrollListenerActive = false;
            this.resizeTimeout = null;
            this.lastScrollTop = 0;
            this.ticking = false;
            this.isInitialized = false;
            
            // Store instance globally
            window.ScrollAnimationManagerInstance = this;
            
            console.log('ScrollAnimationManager created');
            this.init();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupAnimations();
                });
            } else {
                // Use microtask for better timing
                Promise.resolve().then(() => {
                    this.setupAnimations();
                });
            }
        }

        setupAnimations() {
            if (this.isInitialized) {
                console.warn('ScrollAnimationManager already initialized');
                return;
            }
            
            try {
                // Setup core animations
                this.setupIntersectionObservers();
                this.setupEdgeFade();
                this.setupHeaderFade();
                
                this.isInitialized = true;
                console.log('ScrollAnimationManager initialized successfully');
            } catch (error) {
                console.error('Error initializing ScrollAnimationManager:', error);
            }
        }

        setupIntersectionObservers() {
            const animateElements = document.querySelectorAll('[data-animate]');
            
            if (animateElements.length === 0) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -10% 0px'
            });
            
            animateElements.forEach(el => {
                observer.observe(el);
            });
            
            this.observers.push(observer);
        }

        setupEdgeFade() {
            const contentWrapper = document.querySelector('.content-wrapper');
            
            if (!contentWrapper) {
                console.log('Edge fade: No .content-wrapper element found');
                return;
            }
            
            this.contentWrapper = contentWrapper;
            this.setupEdgeFadeListener();
            
            // Initialize with default values
            document.documentElement.style.setProperty('--edge-fade-top', '0');
            document.documentElement.style.setProperty('--edge-fade-bottom', '0');
        }

        setupEdgeFadeListener() {
            const updateEdgeFade = () => {
                if (!this.contentWrapper) return;
                
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                
                const edgeThreshold = Math.min(windowHeight * 0.4, 200);
                
                // Calculate top fade intensity (0 to 1)
                let topFade = 0;
                if (scrollY > 30) {
                    const distanceFromTop = Math.min(scrollY, edgeThreshold);
                    topFade = Math.min(distanceFromTop / edgeThreshold, 1);
                }
                
                // Calculate bottom fade intensity (0 to 1)
                let bottomFade = 0;
                const distanceFromBottom = documentHeight - (scrollY + windowHeight);
                if (distanceFromBottom > 30) {
                    const fadeDistance = Math.min(distanceFromBottom, edgeThreshold);
                    bottomFade = Math.min(fadeDistance / edgeThreshold, 1);
                }
                
                // Set CSS custom properties on document root
                document.documentElement.style.setProperty('--edge-fade-top', topFade);
                document.documentElement.style.setProperty('--edge-fade-bottom', bottomFade);
                
                // Toggle active class
                const shouldBeActive = topFade > 0.05 || bottomFade > 0.05;
                this.contentWrapper.classList.toggle('edge-fade-active', shouldBeActive);
                
                this.ticking = false;
            };
            
            this.edgeFadeHandler = () => {
                if (!this.ticking) {
                    requestAnimationFrame(updateEdgeFade);
                    this.ticking = true;
                }
            };
            
            // Add event listener with error handling
            try {
                window.addEventListener('scroll', this.edgeFadeHandler, { 
                    passive: true,
                    capture: false 
                });
                
                // Initial update
                updateEdgeFade();
                
                console.log('Edge fade listener activated');
            } catch (error) {
                console.error('Error setting up edge fade listener:', error);
            }
        }

        setupHeaderFade() {
            const fadeElements = document.querySelectorAll('.scroll-fade');
            
            if (fadeElements.length === 0) {
                console.log('Header fade: No .scroll-fade elements found');
                return;
            }
            
            this.fadeElements = Array.from(fadeElements);
            this.setupHeaderScrollListener();
            this.setupResizeHandler();
            
            console.log(`Header fade: ${this.fadeElements.length} elements registered`);
        }

        setupHeaderScrollListener() {
            const processScroll = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollingDown = scrollTop > this.lastScrollTop;
                const scrollThreshold = 100;
                
                // Determine visibility state
                const shouldShow = scrollTop <= scrollThreshold || !scrollingDown;
                
                // Update all fade elements
                this.fadeElements.forEach(element => {
                    if (shouldShow) {
                        element.classList.remove('hidden');
                        element.classList.add('visible');
                    } else {
                        element.classList.remove('visible');
                        element.classList.add('hidden');
                    }
                });
                
                this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                this.ticking = false;
            };
            
            this.scrollHandler = () => {
                if (!this.ticking) {
                    requestAnimationFrame(processScroll);
                    this.ticking = true;
                }
            };
            
            try {
                window.addEventListener('scroll', this.scrollHandler, { 
                    passive: true,
                    capture: false 
                });
                
                this.scrollListenerActive = true;
                processScroll(); // Initial state
                
                console.log('Header scroll listener activated');
            } catch (error) {
                console.error('Error setting up header scroll listener:', error);
            }
        }

        setupResizeHandler() {
            this.handleResize = () => {
                clearTimeout(this.resizeTimeout);
                
                this.resizeTimeout = setTimeout(() => {
                    const nowDesktop = window.innerWidth >= 769;
                    
                    // Only react if desktop state changed
                    if (this.isDesktop !== nowDesktop) {
                        console.log(`Viewport changed: ${this.isDesktop ? 'desktop' : 'mobile'} → ${nowDesktop ? 'desktop' : 'mobile'}`);
                        
                        // Always show elements when switching to mobile
                        if (this.isDesktop && !nowDesktop) {
                            this.fadeElements.forEach(element => {
                                element.classList.remove('hidden');
                                element.classList.add('visible');
                            });
                        }
                        
                        this.isDesktop = nowDesktop;
                        
                        // Re-initialize scroll listener for new viewport
                        if (!nowDesktop) {
                            this.cleanupHeaderFade();
                        } else {
                            this.setupHeaderScrollListener();
                        }
                    }
                }, 150);
            };
            
            window.addEventListener('resize', this.handleResize);
        }

        cleanupHeaderFade() {
            if (this.scrollHandler) {
                window.removeEventListener('scroll', this.scrollHandler);
                this.scrollListenerActive = false;
            }
        }

        // Public method to check status
        getStatus() {
            return {
                initialized: this.isInitialized,
                scrollListenerActive: this.scrollListenerActive,
                isDesktop: this.isDesktop,
                fadeElementsCount: this.fadeElements ? this.fadeElements.length : 0,
                edgeFadeActive: this.contentWrapper ? this.contentWrapper.classList.contains('edge-fade-active') : false
            };
        }

        // Public method to manually refresh
        refresh() {
            console.log('Refreshing ScrollAnimationManager...');
            
            // Cleanup existing listeners
            this.destroy();
            
            // Reset state
            this.isInitialized = false;
            this.observers = [];
            
            // Re-initialize
            this.init();
        }

        destroy() {
            console.log('Destroying ScrollAnimationManager...');
            
            // Cleanup all listeners
            this.cleanupHeaderFade();
            
            if (this.edgeFadeHandler) {
                window.removeEventListener('scroll', this.edgeFadeHandler);
            }
            
            if (this.handleResize) {
                window.removeEventListener('resize', this.handleResize);
            }
            
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            
            // Disconnect all observers
            this.observers.forEach(observer => {
                observer.disconnect();
            });
            
            // Clear global instance
            window.ScrollAnimationManagerInstance = null;
            this.isInitialized = false;
        }
    }

    // Export for global access
    window.ScrollAnimationManager = ScrollAnimationManager;
    
} else {
    console.warn('ScrollAnimationManager already defined');
}

// Debug helper for development
if (typeof window.debugScrollManager === 'undefined') {
    window.debugScrollManager = {
        getStatus: () => {
            const instance = window.ScrollAnimationManagerInstance;
            return instance ? instance.getStatus() : 'No active instance';
        },
        refresh: () => {
            const instance = window.ScrollAnimationManagerInstance;
            return instance ? instance.refresh() : 'No active instance';
        },
        testEdgeFade: () => {
            const rootStyles = getComputedStyle(document.documentElement);
            const wrapper = document.querySelector('.content-wrapper');
            
            console.log('=== Edge Fade Debug ===');
            console.log('--edge-fade-top:', rootStyles.getPropertyValue('--edge-fade-top'));
            console.log('--edge-fade-bottom:', rootStyles.getPropertyValue('--edge-fade-bottom'));
            console.log('edge-fade-active class:', wrapper?.classList.contains('edge-fade-active'));
            console.log('Scroll position:', window.scrollY);
            console.log('Viewport height:', window.innerHeight);
            console.log('Document height:', document.documentElement.scrollHeight);
        }
    };
}