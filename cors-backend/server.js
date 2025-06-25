const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3001;

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Sample data for our API
const users = [
  { id: 1, name: 'Amit Lakade', email: 'amit@example.com' },
  { id: 2, name: 'Ram Kale', email: 'ram@example.com' },
];

// 1. Basic CORS - Allow all origins (not recommended for production)
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is public data accessible from any origin' });
});

// 2. CORS with specific origin
const allowedOrigins = ['http://localhost:5173', 'https://your-production-domain.com'];

const specificOriginCors = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
});

app.get('/api/restricted', specificOriginCors, (req, res) => {
  res.json({ 
    message: 'This data is only accessible from specific origins',
    users
  });
});

// 3. CORS with credentials (cookies, auth)
const credentialsCors = cors({
  origin: 'http://localhost:5173', // Must be specific when using credentials
  credentials: true
});

// Login endpoint - sets a cookie
app.post('/api/login', credentialsCors, (req, res) => {
  const { username } = req.body;
  
  // In a real app, you would verify credentials here
  res.cookie('sessionId', 'some-random-session-id', {
    httpOnly: true,
    sameSite: 'none',
    secure: true // Required when sameSite is none
  });
  
  res.json({ message: `Logged in as ${username}` });
});

// Protected endpoint - requires cookie
app.get('/api/protected', credentialsCors, (req, res) => {
  // Check for session cookie
  if (!req.cookies.sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json({ 
    message: 'This is protected data',
    secret: 'You have accessed protected content!'
  });
});

// 4. CORS with custom headers
const customHeadersCors = cors({
  origin: 'http://localhost:5173',
  allowedHeaders: ['X-Custom-Header', 'Content-Type'],
  exposedHeaders: ['X-Custom-Response-Header']
});

app.post('/api/with-headers', customHeadersCors, (req, res) => {
  // Set a custom response header
  res.set('X-Custom-Response-Header', 'Custom-Value');
  
  res.json({
    message: 'This response includes custom headers',
    receivedHeaders: req.headers
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message.includes('CORS')) {
    // Handle CORS errors specifically
    return res.status(403).json({ error: err.message });
  }
  
  // Handle other errors
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});