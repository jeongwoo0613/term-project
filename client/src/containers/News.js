import "./News.css";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import { getLocalToken } from "../utils";
import { getCoins, getUser, getNews } from "../api";

function News() {
  const [articles, setArticles] = useState();

  const loadCoinsName = async () => {
    try {
      const coins = await getCoins();
      const coinsName = coins.reduce((acc, coin, i) => {
        if (i === coins.length - 1) {
          return acc + coin.name;
        }

        return acc + `${coin.name} OR `;
      }, "");

      return coinsName;
    } catch (error) {
      console.log(error);
    }
  };

  const loadNews = async () => {
    const coinsName = await loadCoinsName();
    const news = await getNews(coinsName);
    setArticles(news.articles);
  };

  useEffect(() => {
    const token = getLocalToken();

    if (token) {
      const loadNewsForUser = async () => {
        try {
          const user = await getUser(token);
          const interestCoinsName = user.interests.reduce((acc, coin, i) => {
            if (i === user.interests.length - 1) {
              return acc + coin.name;
            }

            return acc + `${coin.name} OR `;
          }, "");

          if (interestCoinsName.length === 0) {
            loadNews();
          } else {
            const news = await getNews(interestCoinsName);

            if (news.articles.length === 0) {
              loadNews();
            } else {
              setArticles(news.articles);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      loadNewsForUser();
    } else {
      loadNews();
    }
  }, []);

  return articles ? (
    <div className="newsContainer">
      {articles.map(
        ({ title, description, url, urlToImage, publishedAt }, index) => (
          <div className="newsItemContainer" key={index}>
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
            <div>
              <p className="newsDescription">{description}</p>
              <span className="newsPublishedAt">
                {publishedAt.substr(0, 10)}
              </span>
              &nbsp;
              <span className="newsPublishedAt">
                {publishedAt.substr(11, 8)}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  ) : (
    <Loading />
  );
}

export default News;
