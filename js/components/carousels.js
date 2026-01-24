// js/components/carousels.js

// People carousel functionality
function initPeopleCarousel() {
  const people = document.querySelectorAll('.person');
  const leftArrow = document.querySelector('.nav-arrow.left');
  const rightArrow = document.querySelector('.nav-arrow.right');
  
  if (people.length === 0 || !leftArrow || !rightArrow) return;
  
  let currentIndex = 0;
  const totalPeople = people.length;

  // Initialize carousel
  function showPerson(index) {
    // Hide all people
    people.forEach(person => {
      person.classList.remove('active');
    });
    
    // Show the selected person
    people[index].classList.add('active');
  }

  // Show next person
  function nextPerson() {
    currentIndex = (currentIndex + 1) % totalPeople;
    showPerson(currentIndex);
  }

  // Show previous person
  function prevPerson() {
    currentIndex = (currentIndex - 1 + totalPeople) % totalPeople;
    showPerson(currentIndex);
  }

  // Event listeners for arrows
  rightArrow.addEventListener('click', nextPerson);
  leftArrow.addEventListener('click', prevPerson);

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
      nextPerson();
    } else if (e.key === 'ArrowLeft') {
      prevPerson();
    }
  });

  // Initialize the first person
  showPerson(currentIndex);
  
  // Auto-advance every 8 seconds
  setInterval(nextPerson, 8000);
}