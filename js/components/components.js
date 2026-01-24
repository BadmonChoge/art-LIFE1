// js/components/components.js

// Accordion functionality
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !expanded);
      const content = document.getElementById(button.getAttribute('aria-controls'));
      content.hidden = expanded;
    });
  });
}

// FAQ Accordion Functionality
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  // Initialize all to closed state
  faqQuestions.forEach(question => {
    const answer = document.getElementById(question.getAttribute('aria-controls'));
    const arrow = question.querySelector('.faq-icon');
    
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
    answer.style.display = 'none';
    if (arrow) arrow.classList.remove('active');
  });
  
  // Add event listeners to all FAQ questions
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = document.getElementById(this.getAttribute('aria-controls'));
      const arrow = this.querySelector('.faq-icon');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle the state
      const newExpandedState = !isExpanded;
      
      this.setAttribute('aria-expanded', newExpandedState);
      answer.setAttribute('aria-hidden', !newExpandedState);
      
      // Toggle arrow rotation
      if (arrow) arrow.classList.toggle('active');
      
      // Toggle display
      answer.style.display = newExpandedState ? 'block' : 'none';
    });
  });
}

// Filter functionality
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else {
          if (card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // Simple filter functionality
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      // Filter logic would go here
      console.log('Filtering by:', filter);
      // In a real implementation, this would show/hide events
    });
  });
}