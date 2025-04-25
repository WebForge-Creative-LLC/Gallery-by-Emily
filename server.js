const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const brevoApiKey = process.env.BREVO_API_KEY;
const connectedAccountId = process.env.CLIENT_STRIPE_ACCOUNT;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve Static Frontend
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// ✅ Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const items = req.body.items;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items in cart" });
  }

  const line_items = items.map(item => ({
    price: item.priceId,
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL}/thank-you.html`,
      cancel_url: `${process.env.CLIENT_URL}/shop.html`,
    }, {
      stripeAccount: connectedAccountId,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe Checkout Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Brevo Email Sending
app.post('/send-email', async (req, res) => {
  const {
    name,
    email,
    phone,
    artworkType,
    size,
    budget,
    deadline,
    description,
    howFound
  } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: {
        name: "Gallery by Emily Website",
        email: "webforgecreativellc@gmail.com"
      },
      to: [{
        email: "kevinhanson2027@gmail.com",
        name: "Kevin Hanson"
      }],
      subject: `🎨 New Commission Request from ${name}`,
      htmlContent: `
        <h2>New Commission Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Artwork Type:</strong> ${artworkType || 'Not specified'}</p>
        <p><strong>Preferred Size:</strong> ${size || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
        <p><strong>Deadline:</strong> ${deadline || 'Not specified'}</p>
        <p><strong>How Found:</strong> ${howFound || 'Not specified'}</p>
        <h3>Description:</h3>
        <p>${description}</p>
      `
    }, {
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json'
      }
    });

    res.json({ message: '✅ Message sent successfully!' });
  } catch (err) {
    console.error("❌ Brevo Email Error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Email sending failed.' });
  }
});

// ✅ Fallback Route (important for static files!)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// ✅ Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});