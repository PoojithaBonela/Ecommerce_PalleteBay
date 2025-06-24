// server.js
console.log("Starting server...");

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config({ path: '.env.demo' });
require('./auth'); // Google OAuth setup

const app = express();

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'thisisareallysecuresecret123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Import Mongoose Models
const Order = require('./PalleteBay/FrameHue/backend/models/order.js');
const Address = require('./PalleteBay/FrameHue/backend/models/address.js');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/framehue', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// --- ROUTES --- //

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile'],
    prompt: 'select_account',
    accessType: 'online'
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    if (req.user) {
      console.log('User successfully authenticated:', req.user.id);
      res.redirect('/products.html');
    } else {
      console.log('Authentication failed - no user');
      res.redirect('/login');
    }
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

// User API route
app.get('/api/user', isAuthenticated, (req, res) => {
  if (!req.user) {
    return res.status(401).json(null);
  }
  res.json({
    id: req.user._id,
    displayName: req.user.displayName,
    googleId: req.user.googleId
  });
});

// API route to save cart as an order
app.post('/api/checkout', async (req, res) => {
  try {
    const { cart, shippingAddress, paymentMethod } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const newOrder = new Order({
      user: req.user ? req.user._id : null,
      cart,
      shippingAddress: shippingAddress || null, // Save the provided shipping address ID
      paymentMethod: paymentMethod || null // Save the provided payment method
    });

    await newOrder.save();

    res.json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (err) {
    console.error('❌ Checkout error:', err);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// API route to fetch orders for the authenticated user
app.get('/api/orders', isAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }
    const orders = await Order.find({ user: req.user._id })
      .populate('shippingAddress') // Populate the shipping address details
      .exec();
    res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders.' });
  }
});

// API route to fetch addresses for the authenticated user
app.get('/api/addresses', isAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json(addresses);
  } catch (err) {
    console.error('❌ Error fetching addresses:', err);
    res.status(500).json({ message: 'Error fetching addresses.' });
  }
});

// API route to save address data
app.post('/api/address', async (req, res) => { // REMOVE isAuthenticated here
  try {
    const { country, fullname, mobile, pincode, flat, area, landmark, city, state } = req.body;

    if (!country || !fullname || !mobile || !pincode || !flat || !area || !city || !state) {
      return res.status(400).json({ message: 'Please fill in all required address fields.' });
    }

    const newAddress = new Address({
      user: req.user ? req.user._id : null,
      country,
      fullname,
      mobile,
      pincode,
      flat,
      area,
      landmark,
      city,
      state
    });

    await newAddress.save();

    res.status(201).json({ message: 'Address saved successfully!', addressId: newAddress._id });
  } catch (err) {
    console.error('❌ Error saving address:', err);
    res.status(500).json({ message: 'Error saving address.' });
  }
});

// API route to delete an address
app.delete('/api/address/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    const deletedAddress = await Address.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ message: 'Address deleted successfully!' });
  } catch (err) {
    console.error('❌ Error deleting address:', err);
    res.status(500).json({ message: 'Error deleting address.' });
  }
});

// DELETE route for orders
app.delete('/api/orders/:id', isAuthenticated, async (req, res) => {
  console.log(`Attempting to delete order with ID: ${req.params.id}`); // Add this line
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const deletedOrder = await Order.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ message: 'Order deleted successfully!' });
  } catch (err) {
    console.error('❌ Error deleting order:', err);
    res.status(500).json({ message: 'Error deleting order.' });
  }
});

// API route to update payment method for an order
app.put('/api/orders/:id/paymentMethod', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required.' });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: { paymentMethod: paymentMethod } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to update it.' });
    }

    res.status(200).json({ message: 'Payment method updated successfully!', order: updatedOrder });
  } catch (err) {
    console.error('❌ Error updating payment method:', err);
    res.status(500).json({ message: 'Error updating payment method.' });
  }
});

// --- END OF API ROUTES ---

// Specific HTML file routes that require authentication or special handling
// Place these BEFORE app.use(express.static) for 'views' directory
app.get('/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'PalleteBay', 'FrameHue', 'views', 'products.html'));
});

app.get('/product:id.html', (req, res) => {
  const productId = req.params.id;
  const productPath = path.join(__dirname, 'PalleteBay', 'FrameHue', 'views', `product${productId}.html`);
  res.sendFile(productPath, (err) => {
    if (err) {
      console.error(`Error serving product${productId}.html:`, err);
      res.status(404).send('Product page not found');
    }
  });
});

app.get('/yourorders.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'PalleteBay', 'FrameHue', 'views', 'yourorders.html'));
});

// Serve static files from 'views' and 'public' directories
// These should come AFTER any specific HTML file routes that need authentication
app.use(express.static(path.join(__dirname, 'PalleteBay', 'FrameHue', 'views')));
app.use(express.static(path.join(__dirname, 'PalleteBay', 'FrameHue', 'public')));

// Specific HTML file routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'PalleteBay', 'FrameHue', 'views', 'index.html'));
});

app.get('/checkout.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'PalleteBay', 'FrameHue', 'views', 'checkout.html'));
});

// Error handling for authentication
app.get('/auth/error', (req, res) => {
  res.send('Authentication failed');
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('An internal server error occurred.');
});

// Catch-all 404 route - MUST be the last route defined
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
