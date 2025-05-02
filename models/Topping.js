const mongoose = require('mongoose');

const ToppingSchema = new mongoose.Schema({
  userId: String,
  toppingId: String,
  x: Number,
  y: Number
});

module.exports = mongoose.model('Topping', ToppingSchema);
