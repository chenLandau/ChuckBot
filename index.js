import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import { scrapeJokesWebsite } from "./services/scrapeService.js";
import { setUpBot } from "./services/botService.js";

const app = express();
app.use(express.static("public"));
await scrapeJokesWebsite();
setUpBot();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.get("/", (req, res) => {
  res.send("server is running");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is running...");
});
