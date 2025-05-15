// checkout-routes.js - Complete implementation
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Your client's connected account ID
const CONNECTED_ACCOUNT_ID = 'acct_1RGRhvGP18MiPODy';

// Route to create a checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || Object.keys(items).length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }
    
    // Format line items for Stripe
    const lineItems = [];
    
    for (const [priceId, quantity] of Object.entries(items)) {
      lineItems.push({
        price: priceId,
        quantity: quantity
      });
    }
    
    // Create the session with proper transfer_data setup
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/shop.html`,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      // Use your client's account ID as the destination
      payment_intent_data: {
        transfer_data: {
          destination: CONNECTED_ACCOUNT_ID,
        },
        // Optional: Set the application fee amount (how much your platform keeps)
        // This is in cents, so 1000 = $10.00
        application_fee_amount: 500, // Example: $5.00 fee
      }
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;