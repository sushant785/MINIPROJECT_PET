// Import necessary libraries
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison

// Initialize Express
const app = express();
const port = 3008;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB (make sure the DB is already created and running)
mongoose.connect('mongodb://localhost:27017/latest_db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define User schema
const usersSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  orgType: { type: String, required: true },
  contNo: { type: String, required: true },
  emailId: { type: String, required: true },
  Address: { type: String, required: true },
  passWord: { type: String, required: true }
});

// Create User model
const User = mongoose.model('User', usersSchema, 'users');

// Login route
app.post('/LoginOrg', async (req, res) => {
  const { orgName,orgType, passWord } = req.body;

  // Validate input
  if (!orgName ||!orgType || !passWord) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ orgName });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare hashed password with the password provided by the user
    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // If login is successful, send success response (could include a session/token here)
    res.status(200).json({ message: 'Login successful', redirectUrl: 'HomePg.html' });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
