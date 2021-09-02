import "./News.css";
import { useState, useEffect } from "react";
import axios from "axios";
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
      {articles.map(({ title, description, url, urlToImage, publishedAt }) => (
        <div className="newsItemContainer" key={url}>
          <div className="newsThumbnail">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img src={urlToImage} alt="thumbnail" />
            </a>
            <p className="newsTitle">
              <a
                className="newsTitleLink"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            </p>
          </div>
          )
          <div>
            <p className="newsDescription">{description}</p>
            <span className="newsPublishedAt">{publishedAt.substr(0, 10)}</span>
            &nbsp;
            <span className="newsPublishedAt">{publishedAt.substr(11, 8)}</span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Loading />
  );
}

export default News;
