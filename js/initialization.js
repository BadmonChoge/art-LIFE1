// js/initialization.js - Master initialization file
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Initialize performance optimizations first
  if (typeof PerformanceOptimizer !== 'undefined') {
    PerformanceOptimizer.init();
  }
  
  // Initialize navigation
  if (typeof ArtLifeNavigation !== 'undefined') {
    new ArtLifeNavigation();
  }
  
  // Initialize animations
  if (typeof ArtLifeAnimations !== 'undefined') {
    new ArtLifeAnimations();
  }
  
  // NOTE: ScrollAnimationManager is initialized in main.js - NOT HERE
  
  // Initialize form validation
  document.querySelectorAll('form').forEach(form => {
    if (typeof FormValidator !== 'undefined') {
      new FormValidator(form);
    }
  });
  
  // Initialize adaptive images
  if (typeof AdaptiveImage !== 'undefined') {
    AdaptiveImage.init();
  }
  
  // Initialize image loader
  if (typeof ImageLoader !== 'undefined') {
    ImageLoader.init();
  }
  
  // Partner ticker functionality
  const tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    
    tickerTrack.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }
  
  // Partner ticker click handler
  const partnerTicker = document.getElementById('partnerTicker');
  if (partnerTicker) {
    partnerTicker.addEventListener('click', function() {
      window.open('Partners.html', '_blank');
    });
  }
});

// Reset on beforeunload
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});