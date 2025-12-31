import OpenAI from "openai";
import axios from "axios";
import dotenv from "dotenv";
import * as cheerio from "cheerio";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const API_BASE_URL = "http://localhost:3000/api/articles";

const searchForLinks = async (query) => {
  const apiKey = process.env.SERPAPI_KEY;

  const response = await axios.get("https://serpapi.com/search", {
    params: {
      q: query,
      engine: "google",
      api_key: apiKey,
      num: 5,
    },
  });

  const organicResults = response.data.organic_results || [];

  return organicResults
    .filter((r) => r.link && r.link.startsWith("http"))
    .slice(0, 2)
    .map((r) => r.link);
};

// 2️⃣ ADD THIS RIGHT AFTER (helper function)
const scrapeArticleContent = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    let content = "";

    // Try semantic article content
    if ($("article").length) {
      $("article p").each((i, el) => {
        content += $(el).text().trim() + "\n\n";
      });
    }

    // Fallback to paragraphs
    if (!content) {
      $("p").each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          content += text + "\n\n";
        }
      });
    }

    return content.slice(0, 4000);
  } catch (error) {
    console.error("Failed to scrape:", url);
    return "";
  }
};

const rewriteWithAI = async ({ title, originalContent, references }) => {
  try {
    const prompt = `
Rewrite the article titled "${title}" using the reference articles.
Improve structure, clarity, and formatting.
Add a References section at the bottom.

Original Content:
${originalContent}

References:
${references.map((r) => r.content).join("\n\n")}
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_output_tokens: 800, // keep usage LOW
    });

    return response.output_text;
  } catch (error) {
    console.error("⚠️ OpenAI failed, using fallback content");

    // ✅ FALLBACK (important)
    return `
${title}

(This article was programmatically updated based on reference articles.)

${references[0]?.content.slice(0, 1500) || ""}

References:
${references.map((r) => r.link).join("\n")}
`;
  }
};

const runPhaseTwo = async () => {
  try {
    console.log("Fetching oldest articles...");
    const response = await axios.get(`${API_BASE_URL}/oldest`);
    const articles = response.data.data;

    for (const article of articles) {
      console.log(`\n🔍 Searching web for: ${article.title}`);
      const links = await searchForLinks(article.title);

      // remove beyondchats links
      const filteredLinks = links.filter(
        (link) => !link.includes("beyondchats.com")
      );

      console.log("Top reference links:");
      filteredLinks.forEach((link, i) => {
        console.log(`${i + 1}. ${link}`);
      });

      const referenceContents = [];

      for (const link of filteredLinks) {
        console.log("📄 Scraping content from:", link);
        const content = await scrapeArticleContent(link);
        referenceContents.push({ link, content });
      }

      console.log(
        "Scraped reference content length:",
        referenceContents.map((r) => r.content.length)
      );

      const rewrittenContent = await rewriteWithAI({
        title: article.title,
        originalContent: article.content || "",
        references: referenceContents,
      });

      console.log("✍️ AI rewritten content length:", rewrittenContent.length);

      // 🟢 Step 5: Publish updated article
      await axios.post(`${API_BASE_URL}`, {
        title: article.title + " (Updated)",
        content: rewrittenContent,
        sourceUrl: article.sourceUrl,
        isUpdated: true,
        references: referenceContents.map((r) => r.link),
      });

      console.log("✅ Updated article published");
    }
    console.log("\nPhase 2 - Step 2 completed ✅");
    process.exit();
  } catch (error) {
    console.error("Phase 2 failed ❌", error.message);
    process.exit(1);
  }
};

runPhaseTwo();
