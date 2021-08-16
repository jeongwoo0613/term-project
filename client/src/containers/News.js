import "./News.css";
import { useState, useEffect } from "react";
import axios from "axios";
import NewsItem from "./NewsItem";
import Loading from "../components/Loading";

function News() {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://newsapi.org/v2/everything?q=코인&sortBy=publishedAt&apiKey=1dc00b247e534d808d5544eb92faef3e"
        );
        setArticles(response.data.articles);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="test">
      {articles?.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </div>
  );
}

export default News;
