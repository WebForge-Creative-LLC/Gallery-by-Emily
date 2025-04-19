// Events Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Event filtering functionality
    const filterButtons = document.querySelectorAll('.event-filter');
    const eventCards = document.querySelectorAll('.event-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Show/hide event cards based on filter
            eventCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'grid';
                    // Add fade-in animation
                    card.classList.add('fade-in');
                    setTimeout(() => {
                        card.classList.remove('fade-in');
                    }, 500);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Add to Calendar functionality
    const addToCalendarButtons = document.querySelectorAll('.add-to-calendar');
    
    addToCalendarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventName = button.getAttribute('data-event');
            
            // Find event details
            const eventCard = button.closest('.event-card');
            const eventTitle = eventCard.querySelector('h3').textContent;
            const eventDate = eventCard.querySelector('.event-day').textContent + ' ' + 
                             eventCard.querySelector('.event-month').textContent;
            const eventTime = eventCard.querySelector('.event-time').textContent.replace('⏰', '').trim();
            const eventLocation = eventCard.querySelector('.event-location').textContent.replace('📍', '').trim();
            const eventDescription = eventCard.querySelector('.event-description').textContent;
            
            // Create calendar dialog if it doesn't exist
            if (!document.querySelector('.calendar-dialog')) {
                const dialog = document.createElement('div');
                dialog.classList.add('calendar-dialog');
                
                dialog.innerHTML = `
                    <div class="calendar-dialog-content">
                        <button class="calendar-dialog-close">&times;</button>
                        <h2>Add to Calendar</h2>
                        <p id="calendar-event-name"></p>
                        <p id="calendar-event-details"></p>
                        <div class="calendar-options">
                            <div class="calendar-option">
                                <a href="#" class="google-calendar" target="_blank">Google Calendar</a>
                            </div>
                            <div class="calendar-option">
                                <a href="#" class="outlook-calendar" target="_blank">Outlook</a>
                            </div>
                            <div class="calendar-option">
                                <a href="#" class="ical-calendar" download="event.ics">iCal Download</a>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(dialog);
                
                // Add close functionality
                const closeButton = dialog.querySelector('.calendar-dialog-close');
                closeButton.addEventListener('click', () => {
                    dialog.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
                
                dialog.addEventListener('click', (e) => {
                    if (e.target === dialog) {
                        dialog.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            }
            
            // Update and show calendar dialog
            const dialog = document.querySelector('.calendar-dialog');
            const eventNameElement = dialog.querySelector('#calendar-event-name');
            const eventDetailsElement = dialog.querySelector('#calendar-event-details');
            
            eventNameElement.textContent = eventTitle;
            eventDetailsElement.innerHTML = `
                <strong>Date:</strong> ${eventDate}<br>
                <strong>Time:</strong> ${eventTime}<br>
                <strong>Location:</strong> ${eventLocation}
            `;
            
            // In a real implementation, you would generate actual calendar links here
            // For demonstration purposes, we'll use placeholder links
            const googleCalendarLink = dialog.querySelector('.google-calendar');
            const outlookCalendarLink = dialog.querySelector('.outlook-calendar');
            const iCalCalendarLink = dialog.querySelector('.ical-calendar');
            
            // Simulate calendar links (these would be actual calendar URLs in a real implementation)
            googleCalendarLink.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=20230615/20230615&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;
            outlookCalendarLink.href = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&location=${encodeURIComponent(eventLocation)}&body=${encodeURIComponent(eventDescription)}`;
            iCalCalendarLink.href = `data:text/calendar;charset=utf-8,${encodeURIComponent('BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:' + eventTitle + '\nLOCATION:' + eventLocation + '\nDESCRIPTION:' + eventDescription + '\nEND:VEVENT\nEND:VCALENDAR')}`;
            
            // Show dialog
            dialog.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling while dialog is open
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