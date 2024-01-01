import TelegramBot from "node-telegram-bot-api";
import { checkValidJokesArray, getJokeByIndex } from "./jokesService.js";
import { translateText } from "./translateService.js";
const chatLanguages = {};

const handleSetLanguage = async (bot, match, chatId) => {
  const languageFullName = match[1]; // grab the language
  const ln = languageFullName.slice(0, 2).toLowerCase();
  chatLanguages[chatId] = ln;
  const response = await translateText("No problem", ln);
  bot.sendMessage(chatId, response);
};

const handleRegularMessage = async (bot, msg, chatId) => {
  const chatLanguage = chatLanguages[chatId];
  if (chatLanguage === undefined) {
    bot.sendMessage(
      chatId,
      'Hello! Please set the chat language preference using "set language [language]".'
    );
  } else {
    handleNumericMessage(bot, msg, chatId);
  }
};

const handleNumericMessage = async (bot, msg, chatId) => {
  const num = Number(msg.text);
  if (!isNaN(num)) {
    if (1 <= num && num <= 101) {
      const foundJoke = getJokeByIndex(num);
      const translation = await translateText(foundJoke, chatLanguages[chatId]);
      bot.sendMessage(chatId, `${num}. ${translation}`);
    } else {
      const translation = await translateText(
        "Joke number does not exist. Please enter a valid number between 1 and 101",
        chatLanguages[chatId]
      );

      bot.sendMessage(chatId, translation);
    }
  } else {
    const translation = await translateText(
      "Sorry, I'm a robot. I only know how to respond to joke numbers.",
      chatLanguages[chatId]
    );
    bot.sendMessage(chatId, translation);
  }
};

export const setUpBot = () => {
  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    if (!checkValidJokesArray()) {
      bot.sendMessage(chatId, "Sorry, Chuck is not available at the moment.");
    } else {
      const match = msg.text.match(/^set language (\S+)$/i);
      if (match) {
        handleSetLanguage(bot, match, chatId);
      } else {
        handleRegularMessage(bot, msg, chatId);
      }
    }
  });
};
