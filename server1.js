const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Import JWT library

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/testing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

const userSchema = new mongoose.Schema({
  dateOfBirth: Date,
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { dateOfBirth, name, email, password } = req.body;

  try {
    const newUser = new User({ dateOfBirth, name, email, password });
    await newUser.save();

    // Generate a JWT with user information
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, 'your_secret_key', { expiresIn: '1h' });

    // Send the token and user information in the response
    res.status(200).json({ message: 'Registration successful', token, user: { userId: newUser._id, email: newUser.email } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
      // Check if a user with the provided name and password exists in the database
      const user = await User.findOne({ name, password });
  
      if (user) {
        // Generate a JWT with user information
        const token = jwt.sign({ userId: user._id, name: user.name }, 'your_secret_key', { expiresIn: '1h' });
  
        // Send the token and user information in the response
        res.status(200).json({ message: 'Login successful', token, user: { userId: user._id, name: user.name } });
      } else {
        // User not found
        res.status(401).json({ message: 'Login failed. User not found.' });
      }
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Login failed.' });
    }
  });


  


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
