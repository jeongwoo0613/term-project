import "./News.css";
import { useState, useEffect } from "react";
import axios from "axios";
import NewsItem from "./NewsItem";
import Loading from "../components/Loading";

function News() {
  const [articles, setArticles] = useState();

  useEffect(() => {
    const loadNews = async () => {
      try {
        const result = await axios.get(
          "https://newsapi.org/v2/everything?q=코인&sortBy=publishedAt&apiKey=1dc00b247e534d808d5544eb92faef3e"
        );
        setArticles(result.data.articles);
      } catch (error) {
        console.log(error);
      }
    };
    loadNews();
  }, []);

  return articles ? (
    <div className="newsContainer">
      {articles.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </div>
  ) : (
    <Loading />
  );
}

export default News;
