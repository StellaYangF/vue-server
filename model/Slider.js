const mongoose = require('mongoose');
const SliderSchema = new mongoose.Schema({
  url: {
    type: String
  }
});
const SliderModel = mongoose.model('Slider', SliderSchema);
module.exports = SliderModel;