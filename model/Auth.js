const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
  pid: {
    type: Number,
    default: -1,
  },
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  auth: {
    type: String,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  path: {
    type: String,
  },
});

const AuthModel = mongoose.model('Auth', AuthSchema);
module.exports = AuthModel;