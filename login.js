const bcrypt = require('bcryptjs');
const dbConnect = require('../lib/dbConnect');
const User = require('../models/User');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // In a real app, you would generate a token here and send it back for authentication in future requests.
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
