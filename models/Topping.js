
const mongoose = require("mongoose");

const ToppingSchema = new mongoose.Schema({
  userId: String,
  toppingId: String,
  x: Number,
  y: Number,
  container: String // "dough" or "daybox"
});

module.exports = mongoose.model("Topping", ToppingSchema);
