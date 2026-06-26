import { getNews } from "./rss.js";
import { rewriteNews } from "./aiRewrite.js";
import db from "./database.js";

export async function publishNews() {
  try {
    const newsList = await getNews();

    console.log(`Found ${newsList.length} news articles`);

    for (const news of newsList) {
      console.log("Title:", news.title);
      console.log("Link:", news.link);
      console.log("Description:", news.description);
      console.log("Image:", news.image);

      // Step 2: AI Rewrite
      // Step 3: SEO Title
      // Step 4: Database Save
      // Step 5: Duplicate Check
    }

  } catch (error) {
    console.error("Publish Error:", error.message);
  }
}
