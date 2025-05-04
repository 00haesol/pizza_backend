require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Topping = require("./models/Topping");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.post("/save", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!Array.isArray(toppings)) {
      return res.status(400).json({ success: false, message: "Invalid toppings data" });
    }

    // 기존 기록 삭제
    const userId = toppings[0]?.userId;
    if (userId) {
      await Topping.deleteMany({ userId });
    }

    // 새 기록 저장
    
    const toppingsWithExtras = toppings.map(t => ({
      ...t,
      remainingAmount,
      dailyAverage
    }));
    await Topping.insertMany(toppingsWithExtras);
    
    res.json({ success: true });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/load", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const data = await Topping.find({ userId });
    
    const meta = data[0] || {};
    res.json({
      toppings: data,
      remainingAmount: meta.remainingAmount || null,
      dailyAverage: meta.dailyAverage || null
    });
    
  } catch (err) {
    console.error("Load error:", err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.delete("/reset", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, message: "userId 누락됨" });
  }

  try {
    await Topping.deleteMany({ userId });
    res.json({ success: true });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ success: false });
  }
});