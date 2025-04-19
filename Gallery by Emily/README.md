# Gallery by Emily

A responsive website for an artist to showcase and sell artwork, built with HTML, CSS, and JavaScript.

## Website Structure

The website consists of the following pages:

1. **Home Page (index.html)**: Landing page with featured artwork and introduction
2. **Gallery Page (gallery.html)**: Showcase of all artwork with filtering options
3. **Shop Page (shop.html)**: Online store for purchasing prints and originals
4. **About Page (about.html)**: Artist biography and background
5. **Events Page (events.html)**: Information about upcoming farmers markets, pop-ups, and exhibitions
6. **Commission Page (contact.html)**: Form for requesting custom artwork

## Technology Stack

- HTML5 for structure
- CSS3 for styling (with CSS variables for consistent theming)
- Vanilla JavaScript for interactivity
- Responsive design that works on mobile, tablet, and desktop

## File Structure

```
/
├── index.html                # Home page
├── gallery.html              # Gallery page
├── shop.html                 # Shop page
├── about.html                # About page
├── events.html               # Events page
├── contact.html              # Commission/Contact page
├── css/
│   ├── styles.css            # Main stylesheet (shared styles)
│   ├── gallery.css           # Gallery page specific styles
│   ├── shop.css              # Shop page specific styles
│   ├── about.css             # About page specific styles
│   ├── events.css            # Events page specific styles
│   └── contact.css           # Commission page specific styles
├── js/
│   ├── script.js             # Main JavaScript file (shared functionality)
│   ├── gallery.js            # Gallery page specific functionality
│   ├── shop.js               # Shop page specific functionality
│   ├── contact.js            # Commission form functionality
│   └── events.js             # Events page specific functionality
└── images/                   # All website images
    ├── logo.png              # Website logo
    ├── placeholder1.jpg      # Placeholder artwork images (to be replaced)
    ├── placeholder2.jpg      # Placeholder artwork images (to be replaced)
    └── ...                   # Additional images
```

## Maintenance Guide

### Adding New Artwork

To add new artwork to the gallery and shop:

1. Add the image file to the `images/` directory
2. For the gallery, edit the `gallery.html` file and add a new `gallery-item` div with the appropriate data attributes
3. For the shop, edit the `shop.html` file and add a new `product-card` div with the appropriate data attributes

Example gallery item:
```html
<div class="gallery-item" data-category="original">
    <img src="images/your-new-image.jpg" alt="Description of Artwork">
    <div class="gallery-item-info">
        <h3>Artwork Title</h3>
        <p>Category/Medium</p>
        <a href="#" class="btn btn-small">View Details</a>
    </div>
</div>
```

### Updating Events

To update events on the events page:

1. Edit the `events.html` file
2. Find the `events-grid` section
3. Add, edit, or remove the `event-card` divs as needed

### Customizing Colors

The website uses CSS variables for consistent colors throughout. To change the color scheme:

1. Open `css/styles.css`
2. Locate the `:root` section at the top
3. Modify the color values as desired:
   ```css
   :root {
       --primary-color: #ff6b6b;
       --secondary-color: #4ecdc4;
       --accent-color: #ffe66d;
       /* Other color variables */
   }
   ```

## Deployment

This website consists of static files that can be hosted on any web server or hosting platform like:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Traditional web hosting

## Domain Configuration

The website is configured to use the domain `gallerybyemily.com`. After purchasing this domain, point it to your hosting provider using their instructions.

## Future Enhancements

Potential future improvements:

1. Integration with a shopping cart system for easier checkout
2. Blog section for artist updates
3. Customer account system for order history
4. Email newsletter integration
5. Social media feed integration

## Support

For website maintenance assistance, please contact the web developer.

---

© 2023 Gallery by Emily. All rights reserved. 