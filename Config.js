import dotenv from "dotenv";

dotenv.config();

const config = {
  AI_API_KEY: process.env.AI_API_KEY,
  RSS_URL: process.env.RSS_URL,
  PORT: process.env.PORT || 3000,
};

export default config;
