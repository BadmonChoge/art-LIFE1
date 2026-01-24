// js/utils/adaptiveImages.js
const AdaptiveImage = {
    init: function() {  // Changed from arrow function to regular function
        // Check for WebP support
        this.supportsWebP().then(supportsWebP => {
            document.querySelectorAll('[data-adaptive-img]').forEach(img => {
                const src = img.dataset.adaptiveImg;
                const width = Math.min(img.offsetWidth * 2, 1920); // 2x for retina
                
                // Use WebP if supported, fallback to original format
                const format = supportsWebP ? 'webp' : this.getExtension(src);
                
                // Set optimized image source
                img.src = `${src}?format=${format}&width=${width}&quality=80`;
                img.onload = () => img.classList.add('loaded');
            });
        });
    },

    supportsWebP: function() {  // Changed from arrow function to regular function
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    },

    getExtension: function(filename) {  // Changed from arrow function to regular function
        return filename.split('.').pop().toLowerCase();
    },

    supportedFormats: function() {  // Changed from arrow function to regular function
        return ['webp', 'jpg', 'jpeg', 'png']; // Prioritize WebP
    }
};