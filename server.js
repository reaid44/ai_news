import express from "express";
import { getNews } from "./rss.js";
import { startScheduler } from "./scheduler.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Running",
    message: "Trading News Backend v0.01"
  });
});

app.get("/news", async (req, res) => {
  try {
    const news = await getNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Scheduler Start
  startScheduler();
});
