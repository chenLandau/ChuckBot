import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
dotenv.config();
const LOCATION = "eastasia";
const END_POINT = "https://api.cognitive.microsofttranslator.com/translate";
export const translateText = async (text, requestedLanguage) => {
  try {
    const response = await axios.post(
      `${END_POINT}?api-version=3.0&to=${requestedLanguage}&from=en`,
      [
        {
          text: text,
        },
      ],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.KEY_1,
          "Ocp-Apim-Subscription-Region": LOCATION,
          "Content-Type": "application/json",
          "X-ClientTraceId": uuidv4().toString(),
        },
      }
    );
    const translatedText = response.data[0].translations[0].text;
    return translatedText;
  } catch (error) {
    console.log(error.message);
    return "Something went wrong...please try again";
  }
};
