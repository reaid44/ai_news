import Parser from "rss-parser";
import config from "./config.js";

const parser = new Parser();

export async function getNews() {
    try {
        const feed = await parser.parseURL(config.RSS_URL);

        return feed.items.map(item => ({
            title: item.title,
            link: item.link,
            description: item.contentSnippet || item.content || "",
            image: item.enclosure?.url || null,
            date: item.pubDate
        }));
    } catch (error) {
        console.error("RSS Error:", error.message);
        return [];
    }
}
