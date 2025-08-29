import cron from "node-cron";
import { generateMonthlyBills } from "./controller/billController.js";

// Run at 00:05 AM on the 1st of every month
cron.schedule("5 0 1 * *", async () => {
  console.log("📅 Running monthly billing job...");
  await generateMonthlyBills();
});
