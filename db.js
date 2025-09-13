// This is an in-memory database. It will reset on every serverless function cold start.
let users = [];
let messages = [];

module.exports = {
  users,
  messages
};
