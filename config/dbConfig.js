const mongoose = require('mongoose');
const config = require('./index');

mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;