// js/utils/predictiveprefetch.js
const prefetchQueue = new Set();

document.querySelectorAll('nav a, .menu-row a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        if (!prefetchQueue.has(link.href)) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link.href;
            prefetchLink.as = 'document';
            document.head.appendChild(prefetchLink);
            prefetchQueue.add(link.href);
            
            // Preload CSS for linked pages
            const cssPrefetch = document.createElement('link');
            cssPrefetch.rel = 'prefetch';
            cssPrefetch.href = '/css/styles.css';
            cssPrefetch.as = 'style';
            document.head.appendChild(cssPrefetch);
        }
    }, { once: true });
});

// Prefetch based on viewport interactions
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.href) {
            if (!prefetchQueue.has(entry.target.href)) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = entry.target.href;
                prefetchLink.as = 'document';
                document.head.appendChild(prefetchLink);
                prefetchQueue.add(entry.target.href);
            }
        }
    });
}, { threshold: 0.5 });

// Observe important links in the viewport
document.querySelectorAll('a[data-prefetch]').forEach(link => {
    observer.observe(link);
});