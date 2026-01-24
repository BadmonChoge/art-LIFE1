// Enhanced ArtLifeNavigation with Fullscreen Navigation and Scroll Fade
class ArtLifeNavigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupActiveLinks();
    this.setupMobileNavigation();
    this.setupSearch();
    this.setupCopyrightYear();
    this.setupFullscreenNavigation();
    this.setupScrollFading(); // Added scroll fade functionality
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        // Only handle internal page links
        if (this.getAttribute('href').startsWith('#') && 
            window.location.pathname === this.pathname) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            window.scrollTo({
              top: target.offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  setupActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.menu-row a, .mobile-nav a');

    if (sections.length === 0 || navItems.length === 0) return;

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href && href.includes(current)) {
          item.classList.add('active');
        }
      });
    });
  }

  setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('close-btn');

    if (hamburger && mobileNav) {
      // Toggle mobile menu
      hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        mobileNav.setAttribute('aria-hidden', isExpanded);
      });

      // Close menu with close button
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.classList.remove('active');
          mobileNav.classList.remove('active');
          mobileNav.setAttribute('aria-hidden', 'true');
        });
      }

      // Close menu when clicking on links
      const mobileLinks = mobileNav.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.classList.remove('active');
          mobileNav.classList.remove('active');
          mobileNav.setAttribute('aria-hidden', 'true');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (event) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(event.target) && 
            !hamburger.contains(event.target)) {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.classList.remove('active');
          mobileNav.classList.remove('active');
          mobileNav.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  setupSearch() {
    const searchIcon = document.getElementById('search-icon');
    const mobileSearchIcon = document.getElementById('mobile-search-icon');
    const searchOverlay = document.getElementById('search-overlay');

    // Desktop search
    if (searchIcon && searchOverlay) {
      searchIcon.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchOverlay.setAttribute('aria-hidden', 'false');
        document.getElementById('search-input').focus();
      });
    }

    // Mobile search
    if (mobileSearchIcon && searchOverlay) {
      mobileSearchIcon.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchOverlay.setAttribute('aria-hidden', 'false');
        document.getElementById('search-input').focus();
      });
    }

    // Close functionality (works for both)
    if (searchOverlay) {
      document.querySelector('.close-search').addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchOverlay.setAttribute('aria-hidden', 'true');
      });

      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
          searchOverlay.classList.remove('active');
          searchOverlay.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  setupCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  setupFullscreenNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('nav-overlay');
    const navToggles = document.querySelectorAll('.nav-toggle');
    const body = document.body;

    if (hamburger && navOverlay) {
      hamburger.addEventListener('click', () => {
        const isActive = navOverlay.classList.contains('active');
        
        if (!isActive) {
          // Opening the menu
          hamburger.classList.add('active');
          navOverlay.classList.add('active');
          navOverlay.setAttribute('data-bg-color', 'about');
          body.style.overflow = 'hidden';
        } else {
          // Closing the menu via hamburger
          hamburger.classList.remove('active');
          navOverlay.classList.remove('active');
          body.style.overflow = '';
          // Reset all submenus
          document.querySelectorAll('.nav-submenu').forEach(menu => {
            menu.classList.remove('active');
          });
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
      }
    });

    navToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const targetMenu = document.getElementById(targetId);
        const bgColor = toggle.closest('.nav-main-item').getAttribute('data-bg-color');
        
        // Close other menus
        document.querySelectorAll('.nav-submenu').forEach(menu => {
          if (menu.id !== targetId) {
            menu.classList.remove('active');
          }
        });
        
        // Toggle current menu
        targetMenu.classList.toggle('active');
        
        // Change background color
        navOverlay.setAttribute('data-bg-color', bgColor);
      });
    });

    const navLinks = document.querySelectorAll('.nav-submenu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
      });
    });

    // Close when clicking on overlay background (but not on content)
    navOverlay.addEventListener('click', (e) => {
      if (e.target === navOverlay) {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
      }
    });
  }

  setupScrollFading() {
    // Elements to fade out on scroll
    const elementsToFade = [
      document.querySelector('.skyline-container'),
      document.querySelector('.featured-events'),
      document.querySelector('.newsletter')
    ].filter(el => el !== null);
    
    // Only proceed if we have elements to fade
    if (elementsToFade.length === 0) return;
    
    // Store original opacities
    const originalOpacities = elementsToFade.map(el => 
      parseFloat(getComputedStyle(el).opacity) || 1
    );
    
    // Scroll event listener
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    const updateOpacity = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      elementsToFade.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementHeight = rect.height;
        
        // Calculate fade start point (when element is 25% from top of viewport)
        const fadeStart = windowHeight * 0.25;
        
        // Calculate how much the element has been scrolled
        const scrollPercent = Math.max(0, Math.min(1, (scrollY - (elementTop - fadeStart)) / (elementHeight + fadeStart)));
        
        // Apply opacity based on scroll position
        const opacity = Math.max(0, 1 - scrollPercent * 1.5);
        el.style.opacity = opacity;
        el.style.pointerEvents = opacity < 0.3 ? 'none' : 'auto';
      });
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateOpacity);
        ticking = true;
      }
    };
    
    // Throttled scroll event
    window.addEventListener('scroll', () => {
      if (Math.abs(window.scrollY - lastScrollY) > 5) {
        requestTick();
        lastScrollY = window.scrollY;
      }
    });
    
    // Initial call
    updateOpacity();
    
    // Reset on resize
    window.addEventListener('resize', () => {
      updateOpacity();
    });
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ArtLifeNavigation();
});