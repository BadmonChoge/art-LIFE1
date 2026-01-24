// js/main.js - Main functionality file (Universal for ALL pages)

// STRONG duplicate prevention
if (window.mainJSLoaded) {
  throw new Error('main.js already loaded - check for duplicate script tags');
}
window.mainJSLoaded = true;

// Make scrollManager global so we can access it later
let scrollManager;

document.addEventListener('DOMContentLoaded', () => {
  // UNIVERSAL ScrollAnimationManager initialization - WORKS ON ALL PAGES
  function initializeScrollManager() {
    if (typeof ScrollAnimationManager === 'undefined') {
      // Wait a bit and try again (might be loading)
      setTimeout(() => {
        if (typeof ScrollAnimationManager !== 'undefined') {
          createScrollManagerInstance();
        } else {
          console.log('ScrollAnimationManager not available');
        }
      }, 100);
    } else {
      createScrollManagerInstance();
    }
  }

  function createScrollManagerInstance() {
    try {
      // Clear any existing instance first
      if (window.ScrollAnimationManagerInstance) {
        window.ScrollAnimationManagerInstance.destroy();
        window.ScrollAnimationManagerInstance = null;
      }
      
      // Create new instance
      scrollManager = new ScrollAnimationManager();
      window.scrollManager = scrollManager;
      console.log('ScrollAnimationManager initialized on:', window.location.pathname);
    } catch (error) {
      console.error('Error creating ScrollAnimationManager:', error);
    }
  }

  // Initialize scroll manager on ALL pages
  initializeScrollManager();

  // Enhanced Skyline & Hover Text Scroll Behavior
  function setupSkylineScrollBehavior() {
    const skyline = document.querySelector('.skyline-container');
    const hoverText = document.getElementById('hover-text');
    
    // Skip on mobile
    if (window.innerWidth <= 768) {
      if (skyline) skyline.style.display = 'none';
      if (hoverText) hoverText.style.display = 'none';
      return;
    }
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 100;
          
          if (skyline) skyline.classList.toggle('scrolled', scrolled);
          if (hoverText) hoverText.classList.toggle('scrolled', scrolled);
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        if (skyline) skyline.style.display = 'none';
        if (hoverText) hoverText.style.display = 'none';
      } else {
        if (skyline) skyline.style.display = '';
        if (hoverText) hoverText.style.display = '';
        handleScroll(); // Re-check scroll position
      }
    });
  }
  
  // Initialize the skyline scroll behavior AFTER animation completes
  setTimeout(() => {
    setupSkylineScrollBehavior();
  }, 3500); // Wait for entire animation sequence to complete

  // Safe title container shrinking (no opacity changes) - Only on homepage
  if (!document.body.classList.contains('subpage')) {
    window.addEventListener('scroll', () => {
      const titleContainer = document.querySelector('.title-container');
      if (titleContainer && window.scrollY > 100) {
        titleContainer.classList.add('shrink');
      } else if (titleContainer) {
        titleContainer.classList.remove('shrink');
      }
    });
  }
  
  // Mobile header behavior only (no opacity changes) - Works on all pages
  const mobileHeader = document.querySelector('.mobile-header');
  let lastScrollTop = 0;
  const scrollThreshold = 100;
  
  if (mobileHeader) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // Mobile behavior - hide logo when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
          mobileHeader.style.transform = 'translateY(0)';
        } else if (scrollTop > scrollThreshold) {
          mobileHeader.style.transform = 'translateY(-100%)';
        } else {
          mobileHeader.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollTop = scrollTop;
    });
  }

  // FIXED Search functionality with proper accessibility - Works on all pages
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearch = document.querySelector('.close-search');
  const searchInput = document.getElementById('search-input');

  if (searchToggle && searchOverlay && closeSearch && searchInput) {
    
    function openSearch() {
      searchOverlay.setAttribute('aria-hidden', 'false');
      searchOverlay.style.display = 'flex';
      
      // Small delay to ensure overlay is visible before focusing
      setTimeout(() => {
        searchInput.focus();
      }, 50);
    }
    
    function closeSearchOverlay() {
      searchOverlay.setAttribute('aria-hidden', 'true');
      
      // Wait for focus to be cleared before hiding
      setTimeout(() => {
        searchOverlay.style.display = 'none';
        searchInput.blur(); // Ensure input loses focus
      }, 100);
    }
    
    searchToggle.addEventListener('click', openSearch);
    closeSearch.addEventListener('click', closeSearchOverlay);
    
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        closeSearchOverlay();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.getAttribute('aria-hidden') === 'false') {
        closeSearchOverlay();
      }
    });
  }
  
  // Initialize people carousel if it exists on the page
  if (document.querySelector('.person')) {
    initPeopleCarousel();
  }  

  // Initialize FAQ accordion if it exists on the page
  if (document.querySelector('.faq-question')) {
    initFAQAccordion();
  }
  
  // Initialize other components if they exist
  if (document.querySelector('.accordion-header')) {
    initAccordions();
  }
  
  if (document.querySelector('.filter-btn')) {
    initFilters();
  }
});