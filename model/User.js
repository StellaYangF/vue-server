let mongoose = require('../config/dbConfig');

const UserSchema = new mongoose.Schema({
  username: {// 用户名
    type: String,
    required: true,
  },
  password: {
    type: String,
    required:  true,
  },
  name: {
    type: String,
    default: '',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: Number,
    default: -1,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // 0 普通用户 1 管理员
    default: '5ecf7e4a1fb3832918dac1c3', // 普通用户
  },
  avatar: {
    type: String,
    default: ''
  },
  status: { // 1 禁用
    type: String,
    default: 0,
  }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;