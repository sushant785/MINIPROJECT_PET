import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs'; // Import bcryptjs


// Initialize Express
const app = express();
const port = 3006;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/latest_db')
  .then(() => console.log('MongoDB connected to latest_db'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define schema
const usersSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  orgType: { type: String, required: true },
  contNo: { type: String, required: true },
  emailId: { type: String, required: true },
  Address: { type: String, required: true },
  passWord: { type: String, required: true }
});

// Pre-save middleware to hash password
usersSchema.pre('save', async function (next) {
  if (this.isModified('passWord')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.passWord = await bcrypt.hash(this.passWord, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Create model
const User = mongoose.model('User', usersSchema, 'users');

// Handle login requests
app.post('/SignUpOrg', async (req, res) => {
  const { orgName,orgType,contNo, emailId, Address, passWord } = req.body;  // Correct field names

  // Validate input
  if (!orgName || !passWord || !emailId || !Address|| !orgType || !contNo) {
      return res.status(400).send('All fields are required');
  }
  const existingUser = await User.findOne({ emailId });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }


  const cap = /[A-Z]/;
  const small = /[a-z]/;
  const digi = /\d/;
  if(!digi.test(contNo))
  {
      return res.status(400).send("Enter a valid contact number(only digits)");
  }
  if(contNo.length!=10)
    {
        return res.status(400).send("Enter a valid contact number(10 digit)");
    }
    const emailRegex = /^(.*@gmail\.com|.*\.in)$/;
    if(!emailRegex.test(emailId)) {
      return res.status(400).send("Enter a valid email ID");
  }
  if(!digi.test(passWord))
    {
        return res.status(400).send("password must have atleast one digit");
    }
  if(!cap.test(passWord))
    {
        return res.status(400).send("password must have atleast one Capital Letter");
    }
   if(!small.test(passWord))
    {
        return res.status(400).send("password must have atleast one Small Letter");
    }
    const special = /[\d+\-()@]/;
    if(!special.test(passWord))
    {
        return res.status(400).send("password must contain atleast one special charecter")
    }


  try {
      // Create a new student document
      const newUser = new User({ orgName,orgType,contNo, emailId, Address, passWord });  // Use correct field names

      // Save the document
      await newUser.save();
      res.status(200).json({ message: 'Data Saved Successfully', link: '#'});

  } catch (err) {
      console.error('Error saving data:', err);
      res.status(500).send('Error saving data');
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
