// Gallery Filtering Functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                // Remove previous classes
                item.classList.remove('show', 'hide');
                
                // Show all items if filter is 'all'
                if (filterValue === 'all') {
                    item.classList.add('show');
                }
                // Show items that match the filter
                else if (item.getAttribute('data-category') === filterValue) {
                    item.classList.add('show');
                }
                // Hide items that don't match the filter
                else {
                    item.classList.add('hide');
                }
            });
        });
    });
    
    // Initialize gallery (show all items)
    galleryItems.forEach(item => {
        item.classList.add('show');
    });
    
    // Lightbox functionality (optional)
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            // Create lightbox elements
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            
            const lightboxImage = document.createElement('img');
            lightboxImage.src = image.src;
            
            const closeButton = document.createElement('span');
            closeButton.classList.add('lightbox-close');
            closeButton.innerHTML = '&times;';
            
            // Add elements to the DOM
            lightbox.appendChild(lightboxImage);
            lightbox.appendChild(closeButton);
            document.body.appendChild(lightbox);
            
            // Add lightbox open class to body to prevent scrolling
            document.body.classList.add('lightbox-open');
            
            // Close lightbox when clicking the close button or outside the image
            closeButton.addEventListener('click', () => {
                document.body.removeChild(lightbox);
                document.body.classList.remove('lightbox-open');
            });
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                    document.body.classList.remove('lightbox-open');
                }
            });
        });
    });
}); 