import { executablePath } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { addJoke, checkValidJokesArray } from "./jokesService.js";
import * as dotenv from "dotenv";
dotenv.config();
puppeteer.use(StealthPlugin());

const JOKES_URL = "https://parade.com/968666/parade/chuck-norris-jokes/";
const PROXY_URL = `https://app.scrapingbee.com/api/v1/?api_key=${process.env.PROXY_KEY}`;

export const scrapeJokesWebsite = async () => {
  await tryScrapingUrl(JOKES_URL);
  if (!checkValidJokesArray) {
    const proxyUrl = `${PROXY_URL}&url=${JOKES_URL}`;
    await tryScrapingUrl(proxyUrl);
  }
};
export const tryScrapingUrl = async (url) => {
  const browser = await puppeteer.launch({
    headless: "new",
    ignoreHTTPSErrors: true,
    executablePath: executablePath(),
  });
  const page = await browser.newPage();
  try {
    await page.goto(url, { timeout: 60000 });
    await page.waitForSelector(".m-detail--body");
    const jokesItems = await page.$$(".m-detail--body > ol > li");
    for (let i = 0; i < jokesItems.length; i++) {
      const jokeItem = jokesItems[i];
      const jokeText = await jokeItem.evaluate((joke) => joke.textContent);
      addJoke(jokeText);
    }
    console.log("scraping succeeded");
  } catch (error) {
    console.log("scraping failed", error.message);
  }
  await browser.close();
};
