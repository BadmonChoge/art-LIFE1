// js/utils/imageLoader.js
class ImageLoader {
    static init() {
        this.checkConnection();
        this.loadBackgroundImages();
        this.lazyLoadImages();
        this.setupImageErrorHandling(); 
    }

    static setupImageErrorHandling() {
        // Handle existing images
        document.querySelectorAll('img').forEach(img => {
            this.addErrorHandler(img);
        });

        // Handle future images (dynamically added)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'IMG') {
                            this.addErrorHandler(node);
                        }
                        // Check for images inside added nodes
                        node.querySelectorAll && node.querySelectorAll('img').forEach(img => {
                            this.addErrorHandler(img);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    static addErrorHandler(img) {
        // Skip if already handled or if it's a data URL/SVG
        if (img.hasAttribute('data-error-handled') || 
            img.src.startsWith('data:') || 
            img.src.includes('.svg')) {
            return;
        }
        
        img.setAttribute('data-error-handled', 'true');
        
        img.addEventListener('error', function() {
            const width = this.width || 300;
            const height = this.height || 200;
            const alt = this.alt || 'Image';
            
            // Create SVG fallback
            const svgString = `
                <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#2a2a2d"/>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                          fill="#666" font-family="Arial, sans-serif" font-size="14">${alt}</text>
                </svg>
            `;
            
            this.src = 'data:image/svg+xml;base64,' + btoa(svgString);
            this.classList.add('image-fallback');
        });
    }

    static checkConnection() {
        if (navigator.connection) {
            const connection = navigator.connection || navigator.mozConnection;
            if (connection.effectiveType.includes('2g') || connection.saveData) {
                document.documentElement.classList.add('low-bandwidth');
            }
            
            // Monitor connection changes
            connection.addEventListener('change', () => {
                if (connection.effectiveType.includes('2g') || connection.saveData) {
                    document.documentElement.classList.add('low-bandwidth');
                } else {
                    document.documentElement.classList.remove('low-bandwidth');
                }
            });
        }
    }

    static loadBackgroundImages() {
        document.querySelectorAll('[data-bg-src]').forEach(el => {
            if (document.documentElement.classList.contains('low-bandwidth')) {
                // Skip or load low-quality versions on slow connections
                return;
            }

            const src = el.dataset.bgSrc;
            const img = new Image();
            img.src = src;
            img.onload = () => {
                el.style.backgroundImage = `url(${src})`;
                el.classList.add('bg-loaded');
            };
        });
    }

    static lazyLoadImages() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    img.classList.add('lazy-loaded');
                    observer.unobserve(img);
                }
            });
        }, { 
            rootMargin: '200px 0px', // Load images 200px before they enter viewport
            threshold: 0.01 
        });

        // Observe images with data-src or data-srcset
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            observer.observe(img);
        });
    }

    static preloadCriticalImages() {
        // Preload above-the-fold images
        const criticalImages = [
            document.querySelector('.hero img'),
            document.querySelector('.logo img')
        ].filter(img => img !== null);

        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });
    }
}