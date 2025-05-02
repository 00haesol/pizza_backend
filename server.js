const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topping = require('./models/Topping');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// POST /save
app.post('/save', async (req, res) => {
  const { toppings } = req.body;
  if (!Array.isArray(toppings) || toppings.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid toppings data' });
  }

  const userId = toppings[0].userId;
  try {
    await Topping.deleteMany({ userId }); // 기존 데이터 삭제
    await Topping.insertMany(toppings);   // 새 데이터 저장
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to save toppings' });
  }
});

// GET /load?userId=steam
app.get('/load', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Missing userId' });
  }

  try {
    const toppings = await Topping.find({ userId });
    res.json(toppings.map(t => ({
      toppingId: t.toppingId,
      x: t.x,
      y: t.y
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load toppings' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
