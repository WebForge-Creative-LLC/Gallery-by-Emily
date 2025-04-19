# Gallery by Emily

A portfolio and e-commerce website for art featuring Netlify Functions for Stripe checkout and email functionality.

## Local Development

### Prerequisites
- Node.js (v14 or newer)
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/gallery-by-emily.git
cd gallery-by-emily
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
Create a file `netlify/.env` with the following variables:
```
# Stripe
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Your site URL for redirect
URL=http://localhost:8888

# SMTP (your Postfix server or any SMTP relay)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=smtp-user
SMTP_PASS=your-smtp-pass

# Where contact‑form emails go
CONTACT_EMAIL=hello@gallerybyemily.com
```

4. Start the development server:
```bash
npm run dev
```

5. Visit http://localhost:8888 to view the site

## Deploying to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. In the Netlify UI, add the environment variables in "Site settings > Build & deploy > Environment"
4. Deploy!

## Features

- Static website with responsive design
- Stripe integration for payments
- SMTP email sending for contact forms
- Netlify Functions for serverless backend functionality

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