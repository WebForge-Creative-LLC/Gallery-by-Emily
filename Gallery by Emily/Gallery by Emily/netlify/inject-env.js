// This script will be run during build to inject environment variables into HTML files
const fs = require('fs');
const path = require('path');

// Read the shop.html file
const shopHtmlPath = path.join(__dirname, '../shop.html');
let shopHtml = fs.readFileSync(shopHtmlPath, 'utf8');

// Replace the placeholder with the actual Stripe publishable key from environment variables
shopHtml = shopHtml.replace(
  "const stripePublicKey = 'pk_test_your_test_key';",
  `const stripePublicKey = '${process.env.STRIPE_PUBLISHABLE_KEY}';`
);

// Write the updated HTML back to the file
fs.writeFileSync(shopHtmlPath, shopHtml);

console.log('Environment variables injected into HTML files successfully!'); 