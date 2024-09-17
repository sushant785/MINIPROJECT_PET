import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs'; // Import bcryptjs

// Initialize Express
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/latest_db')
  .then(() => console.log('MongoDB connected to latest_db'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define schema
const studentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  emailId: { type: String, required: true },
  Address: { type: String, required: true },
  passWord: { type: String, required: true },
});

// Pre-save middleware to hash password
studentSchema.pre('save', async function (next) {
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
const Student = mongoose.model('Student', studentSchema, 'students');

// Handle login requests
app.post('/SignUpAdpt', async (req, res) => {
  const { userName, emailId, Address, passWord } = req.body;  // Correct field names

  // Validate input
  if (!userName || !passWord || !emailId || !Address) {
      return res.status(400).send('All fields are required');
  }

  const cap = /[A-Z]/;
  const small = /[a-z]/;
  const digi = /\d/;
 
  
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


    // Destructure fields from request body
    
      try {
        // Create a new student document using the correct field names
        const newStudent = new Student({ userName, emailId, Address, passWord });
    
        // Save the document
        await newStudent.save();
        
        // Send a success response
        res.status(200).json({ message: 'Data Saved Successfully'});
      } catch (err) {
        console.error('Error saving data:', err);
        
        // Send error response
        res.status(500).json({ message: 'Error saving data', error: err.message });
      }
    });
    


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
