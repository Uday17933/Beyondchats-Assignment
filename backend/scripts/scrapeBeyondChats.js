import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import Article from "../models/article.model.js";
import connectdb from "../config/db.js";

dotenv.config();

// main scraper function
const scrapeBeyondChats = async () => {
  try {
    // connect to database
    await connectdb();

    const BASE_URL = "https://beyondchats.com/blogs/";

    console.log("Fetching blogs page...");

    // 1️⃣ fetch blogs page
    const response = await axios.get(BASE_URL);
    const html = response.data;
    const $ = cheerio.load(html);

    // 2️⃣ find last page number from pagination
    let lastPage = 1;

    $(".page-numbers").each((i, el) => {
      const pageText = $(el).text();
      const pageNum = parseInt(pageText);

      if (!isNaN(pageNum) && pageNum > lastPage) {
        lastPage = pageNum;
      }
    });

    console.log("Last page found:", lastPage);

    // 3️⃣ fetch last page (oldest articles)
    const lastPageUrl = `${BASE_URL}page/${lastPage}/`;
    const lastPageResponse = await axios.get(lastPageUrl);
    const lastPageHtml = lastPageResponse.data;
    const $$ = cheerio.load(lastPageHtml);

    // 4️⃣ extract first 5 articles
    const articles = [];
    let currentPage = lastPage;

    while (articles.length < 5 && currentPage > 0) {
      const pageUrl =
        currentPage === lastPage
          ? `${BASE_URL}page/${currentPage}/`
          : `${BASE_URL}page/${currentPage}/`;

      console.log("Checking page:", pageUrl);

      const pageResponse = await axios.get(pageUrl);
      const pageHtml = pageResponse.data;
      const $$ = cheerio.load(pageHtml);

      $$("article").each((i, el) => {
        if (articles.length >= 5) return;

        const titleElement = $$(el).find("h2 a");
        const title = titleElement.text().trim();
        const link = titleElement.attr("href");

        if (title && link) {
          articles.push({
            title,
            content: "Content will be fetched later",
            sourceUrl: link.startsWith("http")
              ? link
              : `https://beyondchats.com${link}`,
            isUpdated: false,
          });
        }
      });

      currentPage--;
    }

    console.log(`Found ${articles.length} articles`);

    // take only 5 oldest
    const oldestFive = articles.slice(0, 5);

    console.log(`Found ${oldestFive.length} articles`);

    // 5️⃣ save articles to DB
    for (const article of oldestFive) {
      const exists = await Article.findOne({ sourceUrl: article.sourceUrl });
      if (!exists) {
        await Article.create(article);
        console.log("Saved:", article.title);
      } else {
        console.log("Already exists:", article.title);
      }
    }

    console.log("Scraping completed ✅");
    process.exit();
  } catch (error) {
    console.error("Scraping failed ❌", error.message);
    process.exit(1);
  }
};

// run scraper
scrapeBeyondChats();
