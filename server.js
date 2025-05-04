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

// ✅ 메모리 내 DB 대체용 (별도 모델 생성 없이)
const storeMeta = {}; // { team: { remainingAmount: 12345678 } }

app.post("/save", async (req, res) => {
  try {
    const { toppings, userId, remainingAmount, dailyAverage } = req.body;

    if (userId === "team") {
      if (!storeMeta[userId]) storeMeta[userId] = {};
      if (remainingAmount !== undefined) storeMeta[userId].remainingAmount = remainingAmount;
      if (dailyAverage !== undefined) storeMeta[userId].dailyAverage = dailyAverage;
      return res.json({ success: true });
    }

    if (!Array.isArray(toppings)) {
      return res.status(400).json({ success: false, message: "Invalid toppings data" });
    }

    // 기존 기록 삭제
    if (userId) {
      await Topping.deleteMany({ userId });
    }

    // 새 기록 저장
    await Topping.insertMany(toppings);
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

    if (userId === "team") {
      return res.json(storeMeta[userId] || {});
    }

    const data = await Topping.find({ userId });
    res.json(data);
  } catch (err) {
    console.error("Load error:", err);
    res.status(500).json({ success: false });
  }
});

app.delete("/reset", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, message: "userId 누락됨" });
  }

  try {
    if (userId === "team") {
      delete storeMeta[userId];
      return res.json({ success: true });
    }

    await Topping.deleteMany({ userId });
    res.json({ success: true });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
