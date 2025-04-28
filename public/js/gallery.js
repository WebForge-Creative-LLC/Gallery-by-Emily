// Gallery Filtering Functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Filter function
    function filterGallery(category) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            // Remove all classes first
            item.classList.remove('show', 'hide');

            if (category === 'all' || category === itemCategory) {
                item.classList.add('show');
            } else {
                item.classList.add('hide');
            }
        });
    }

    // Initialize to show all items
    filterGallery('all');

    // Click handlers for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            filterGallery(filterValue);
        });
    });

    // Lightbox functionality
    const galleryImages = document.querySelectorAll('.gallery-item img');

    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');

            const lightboxImage = document.createElement('img');
            lightboxImage.src = image.src;

            const closeButton = document.createElement('span');
            closeButton.classList.add('lightbox-close');
            closeButton.innerHTML = '&times;';

            lightbox.appendChild(lightboxImage);
            lightbox.appendChild(closeButton);
            document.body.appendChild(lightbox);
            document.body.classList.add('lightbox-open');

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