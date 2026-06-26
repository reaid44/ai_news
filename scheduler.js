import cron from "node-cron";
import { publishNews } from "./publish.js";

export function startScheduler() {
  // প্রতি 30 মিনিটে একবার চালাবে
  cron.schedule("*/30 * * * *", async () => {
    console.log("Checking for new news...");

    try {
      await publishNews();
      console.log("Publish completed.");
    } catch (err) {
      console.error("Scheduler Error:", err.message);
    }
  });

  console.log("Scheduler started.");
}
