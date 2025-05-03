const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

// ───────────────────────────── LOAD ENVIRONMENT VARIABLES
dotenv.config();

// ───────────────────────────── APP SETUP
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

// ───────────────────────────── MIDDLEWARE
app.use(cors({
  origin: process.env.DOMAIN
}));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// ───────────────────────────── STRIPE CHECKOUT
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  if (!items || Object.keys(items).length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const line_items = Object.entries(items)
    .filter(([price, quantity]) => price && !isNaN(quantity) && Number(quantity) > 0)
    .map(([price, quantity]) => ({
      price,
      quantity: Number(quantity)
    }));

  if (line_items.length === 0) {
    return res.status(400).json({ error: 'No valid line items found' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${process.env.DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/cart.html`,
      payment_intent_data: {
        transfer_data: {
          destination: process.env.CLIENT_CONNECT_ACCOUNT
        }
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error →', err.response?.data || err.message || err);
    res.status(500).json({ error: err.message || 'Unknown Stripe error' });
  }
});

// ───────────────────────────── BREVO EMAIL HANDLER
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'Gallery by Emily Contact Form', email: 'webforgecreativellc@gmail.com' },
        to: [{ email: 'webforgecreativellc@gmail.com', name: 'Gallery by Emily' }],
        replyTo: { email, name },
        subject: `Website inquiry from ${name}`,
        htmlContent: `<p>${message}</p>`
      },
      { headers: { 'api-key': process.env.BREVO_API_KEY } }
    );
    res.json({ message: 'Message sent ✔️' });
  } catch (err) {
    console.error('Brevo error →', err.response?.data || err.message);
    res.status(500).json({ error: 'Email failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
