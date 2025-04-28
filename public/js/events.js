// Events Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Event filtering functionality
    const filterButtons = document.querySelectorAll('.event-filter');
    const eventCards = document.querySelectorAll('.event-card');

    // Filter function
    function filterEvents(category) {
        // First, update the active state of filter buttons
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Then, filter the event cards
        eventCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (category === 'all' || category === cardCategory) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Initialize to show all events
    filterEvents('all');

    // Click handlers for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            filterEvents(filterValue);
        });
    });

    // Add to Calendar functionality
    const addToCalendarButtons = document.querySelectorAll('.add-to-calendar');

    addToCalendarButtons.forEach(button => {
        button.addEventListener('click', function () {
            const eventName = this.getAttribute('data-event');
            // Here you would implement the calendar integration
            alert(`Added ${eventName} to your calendar!`);
        });
    });

    // Newsletter signup form submission
    const signupForm = document.querySelector('.signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = signupForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                // In a real implementation, you would send this to your server or email service
                // For demonstration, we'll show a success message

                // Create success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('signup-success');
                successMessage.innerHTML = `
                    <p><strong>Thank you for subscribing!</strong></p>
                    <p>You'll now receive updates about upcoming events.</p>
                `;

                // Replace form with success message
                signupForm.style.display = 'none';
                signupForm.parentNode.appendChild(successMessage);

                // Reset form for future use
                signupForm.reset();
            }
        });
    }

    // Add animations for event cards when they come into view
    function animateOnScroll() {
        const eventCards = document.querySelectorAll('.event-card');

        eventCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (cardPosition < screenPosition) {
                card.classList.add('animate-in');
            }
        });
    }

    // Initial check for elements in view
    animateOnScroll();

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
}); 