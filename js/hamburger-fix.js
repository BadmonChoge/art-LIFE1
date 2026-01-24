// hamburger-fix.js - Complete hamburger menu functionality with submenus
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('nav-overlay');
  const body = document.body;
  const navToggles = document.querySelectorAll('.nav-toggle');

  if (hamburger && navOverlay) {
    // Simple hamburger toggle function
    function toggleMenu() {
      const isActive = navOverlay.classList.contains('active');
      
      if (!isActive) {
        // Open menu
        hamburger.classList.add('active');
        navOverlay.classList.add('active');
        navOverlay.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden';
      } else {
        // Close menu
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        navOverlay.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        
        // Close all submenus when closing main menu
        document.querySelectorAll('.nav-submenu').forEach(menu => {
          menu.classList.remove('active');
        });
      }
    }

    // Submenu toggle function
    function setupSubmenus() {
      navToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const targetId = this.getAttribute('data-target');
          const targetMenu = document.getElementById(targetId);
          
          if (targetMenu) {
            // Close other submenus
            document.querySelectorAll('.nav-submenu').forEach(menu => {
              if (menu.id !== targetId && menu.classList.contains('active')) {
                menu.classList.remove('active');
              }
            });
            
            // Toggle current submenu
            targetMenu.classList.toggle('active');
            
            // Update background color if needed
            const bgColor = this.closest('.nav-main-item').getAttribute('data-bg-color');
            if (bgColor) {
              navOverlay.setAttribute('data-bg-color', bgColor);
            }
          }
        });
      });
    }

    // Add click event to hamburger
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking on navigation links
    const navLinks = navOverlay.querySelectorAll('.nav-submenu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        navOverlay.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        
        // Close all submenus
        document.querySelectorAll('.nav-submenu').forEach(menu => {
          menu.classList.remove('active');
        });
      });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });

    // Close when clicking outside of menu content
    navOverlay.addEventListener('click', (e) => {
      if (e.target === navOverlay) {
        toggleMenu();
      }
    });

    // Set up submenu functionality
    setupSubmenus();
  }
});