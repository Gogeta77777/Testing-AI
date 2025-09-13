const dbConnect = require('../lib/dbConnect');
const Message = require('../models/Message');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({ message: 'Username and text are required' });
    }

    const message = new Message({
      username,
      text,
    });

    await message.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
