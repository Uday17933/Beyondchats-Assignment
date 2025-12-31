import { useEffect, useState } from "react";
import { fetchUpdatedArticles } from "../services/api";
import ArticleCard from "../components/ArticleCard";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchUpdatedArticles()
      .then((res) => setArticles(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "40px 16px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "32px" }}>
        BeyondChats Articles
      </h1>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto", // ⭐ real centering
        }}
      >
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Home;
