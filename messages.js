const dbConnect = require('../lib/dbConnect');
const Message = require('../models/Message');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const lastReceived = req.query.lastReceived ? new Date(req.query.lastReceived) : new Date(0);

    // We'll wait for new messages for up to 10 seconds
    const timeout = 10000; // 10 seconds
    const startTime = Date.now();

    let messages = await Message.find({ createdAt: { $gt: lastReceived } }).sort({ createdAt: 1 });

    while (messages.length === 0 && (Date.now() - startTime) < timeout) {
      // Wait for 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      messages = await Message.find({ createdAt: { $gt: lastReceived } }).sort({ createdAt: 1 });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
