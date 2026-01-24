// UPDATED Animation sequence - using the same pattern as hover text
function startAnimation() {
  // Disable scrolling during animation
  document.documentElement.style.overflow = 'hidden';
  
  // ✅ ADDED: Ensure all elements start hidden
  const elementsToHide = document.querySelectorAll('.menu-bar, .skyline-container, #search-icon-container, #hover-text, .content-wrapper, .site-footer, .mobile-header, .ticker-container');
  elementsToHide.forEach(el => {
    if (el) {
      el.classList.remove('visible'); // Ensure they start hidden
    }
  });

  // Phase 1: Words enter from off-screen (1.2s)
  setTimeout(() => {
    document.body.classList.add('phase-1');
    
    // Phase 2: Pause at center (0.8s)
    setTimeout(() => {
      document.body.classList.add('phase-2');
      
      // Phase 3: Move to final position (1.5s)
      setTimeout(() => {
        document.body.classList.add('phase-3');
        
        // After logo settles, reveal ALL elements using the SAME pattern as hover text
        setTimeout(() => {
          // Show ALL elements with the same 'visible' class pattern
          const elementsToShow = document.querySelectorAll('.menu-bar, .skyline-container, #search-icon-container, #hover-text, .content-wrapper, .site-footer, .mobile-header, .ticker-container');
          
          elementsToShow.forEach(el => {
            if (el) {
              el.classList.add('visible'); // Same pattern as hover text
            }
          });
          
          // Add class to enable cursor only after animation is complete
          const hoverText = document.getElementById('hover-text');
          if (hoverText && window.innerWidth >= 1024) {
            hoverText.classList.add('typewriter-ready');
          }
          
          // Enable scrolling after completion
          document.documentElement.style.overflow = 'auto';
          
          // Start typewriter only on large screens
          if (window.innerWidth >= 1024 && hoverText) {
            typewriter.start(hoverText, "Welcome to Art-Life Group where we help turn an idea into reality");
          }
        }, 300); // Short delay after logo settles
      }, 800);
    }, 1200);
  }, 100);
}

// Global typewriter instance
let typewriter;

window.addEventListener('load', () => {
  // Initialize typewriter
  typewriter = new Typewriter();
  
  if (!document.body.classList.contains('subpage')) {
    startAnimation();
  } else {
    // defense: remove any phase classes if some other script added them
    document.body.classList.remove('phase-1','phase-2','phase-3');
    // ensure words are visible (in case styles are applied inline earlier)
    document.querySelectorAll('.word.art, .word.life, .subpage-word.art, .subpage-word.life')
      .forEach(w => { 
        if (w) {
          w.style.transform = 'none'; 
          w.style.opacity = '1'; 
        }
      });
  }
});

// Enhanced Typewriter with Line Balancing and Screen Size Detection
class Typewriter {
  constructor() {
    this.timer = null;
    this.element = null;
    this.fullText = '';
    this.currentText = '';
    this.speed = 30;
    this.isTyping = false;
    this.animationStart = 0;
    this.isLargeScreen = window.innerWidth >= 1024;
  }
  
  balanceLines(text) {
    if (!this.element) return text;

    const testSpan = document.createElement('span');
    testSpan.style.visibility = 'hidden';
    testSpan.style.position = 'absolute';
    testSpan.style.whiteSpace = 'nowrap';
    testSpan.style.font = window.getComputedStyle(this.element).font;
    document.body.appendChild(testSpan);

    const words = text.split(' ');
    const lines = [];
    let currentLine = [];
    let currentWidth = 0;
    const maxWidth = this.element.offsetWidth * 0.9;

    words.forEach(word => {
      testSpan.textContent = word;
      const wordWidth = testSpan.offsetWidth;

      if (currentWidth + wordWidth > maxWidth && currentLine.length > 0) {
        lines.push(currentLine.join(' '));
        currentLine = [word];
        currentWidth = wordWidth;
      } else {
        currentLine.push(word);
        currentWidth += wordWidth + 5;
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }

    document.body.removeChild(testSpan);
    return lines.join('<br>');
  }

  start(element, text, speed = 30) {
    // Safety check - if element doesn't exist, do nothing
    if (!element) return;
    
    // Only desktop
    if (!this.isLargeScreen) {
      element.textContent = '';
      element.style.visibility = 'hidden';
      return;
    }

    this.stop();
    this.element = element;
    this.fullText = this.balanceLines(text);
    this.currentText = '';
    this.speed = speed;
    this.isTyping = true;
    this.animationStart = performance.now();

    this.element.innerHTML = '';
    this.element.style.visibility = 'visible';
    this.type();
  }

  type() {
    // Safety checks
    if (!this.isTyping || !this.isLargeScreen || !this.element) return;

    const elapsed = performance.now() - this.animationStart;
    const targetChars = Math.floor(elapsed / this.speed);

    if (targetChars > this.fullText.length) {
      this.stop();
      return;
    }

    const newText = this.fullText.substring(0, targetChars);

    if (newText !== this.currentText) {
      this.currentText = newText;
      this.element.textContent = this.currentText.replace(/<br>/g, '\n');
      const measuredText = this.balanceLines(this.element.textContent);
      this.element.innerHTML = measuredText;
      void this.element.offsetHeight;
    }

    if (targetChars < this.fullText.length) {
      this.timer = requestAnimationFrame(() => this.type());
    } else {
      this.isTyping = false;
    }
  }

  stop() {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    // Safety check for element existence
    if (this.element && this.fullText && this.isLargeScreen) {
      this.element.innerHTML = this.balanceLines(this.fullText);
    }
    this.isTyping = false;
  }
}

class ArtLifeAnimations {
  constructor() {
    this.typewriter = new Typewriter();
    this.initializeAnimations();
    this.setupEventListeners();
  }

  initializeAnimations() {
    this.setupScrollReveal();
    this.setupHoverText();
  }

  setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el, index) => {
      if (!el) return;
      
      const delay = index * 100;
      el.style.setProperty('--reveal-delay', `${delay}ms`);
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(el);
    });
  }

  setupHoverText() {
    const menuLinks = document.querySelectorAll('.menu-row a');
    const hoverText = document.getElementById('hover-text');
    if (!hoverText) return;

    // Only set up on larger screens
    if (window.innerWidth < 1024) {
      hoverText.style.visibility = 'hidden';
      return;
    }
    
    let currentHoverItem = null;
    menuLinks.forEach(item => {
      if (!item) return;
      
      item.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        if (item.dataset.text) {
          currentHoverItem = item;
          this.typewriter.start(hoverText, item.dataset.text);
        }
      });
      item.addEventListener('mouseleave', () => {
        if (currentHoverItem === item) {
          const defaultText = "Welcome to Art-Life Group where we help turn an idea into reality";
          this.typewriter.start(hoverText, defaultText);
          currentHoverItem = null;
        }
      });
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', this.debounce(() => {
      this.handleResponsiveAnimations();
    }, 100));

    this.handleMotionPreference();
  }

  handleResponsiveAnimations() {
    const hoverText = document.getElementById('hover-text');
    
    // Update screen size detection
    this.typewriter.isLargeScreen = window.innerWidth >= 1024;
    
    // Safe null checks for hoverText
    if (window.innerWidth < 1024) {
        if (hoverText) {
            hoverText.classList.remove('typewriter-ready');
            hoverText.classList.remove('typewriter-cursor');
            hoverText.style.visibility = 'hidden';
            hoverText.textContent = '';
        }
    } else {
        if (hoverText) {
            hoverText.classList.add('typewriter-ready');
            hoverText.classList.add('typewriter-cursor');
            hoverText.style.visibility = 'visible';
            // Restart the typewriter with welcome text
            const defaultText = "Welcome to Art-Life Group where we help turn an idea into reality";
            this.typewriter.start(hoverText, defaultText);
        }
    }
  }

  handleMotionPreference() {
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

  debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
}