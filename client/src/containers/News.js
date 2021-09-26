import "./News.css";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import { getLocalToken } from "../utils/storage.util";
import { getCoins } from "../api/coins.api";
import { getUser } from "../api/users.api";
import { loadNews } from "../api/news.api";

function News() {
  const [articles, setArticles] = useState();

  const loadCoinsName = async () => {
    try {
      const coins = await getCoins();
      const coinsName = coins.reduce((acc, coin, i) => {
        if (i === coins.length - 1) {
          return (acc += coin.name);
        }

        return (acc += `${coin.name} OR `);
      }, "");

      return coinsName;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    if (getLocalToken()) {
      const loadNewsForUser = async () => {
        try {
          const user = await getUser(getLocalToken());
          const coinsName = user.interests.reduce((acc, coin, i) => {
            if (i === user.interests.length - 1) {
              return (acc += coin.name);
            }

            return (acc += `${coin.name} OR `);
          }, "");

          if (coinsName.length === 0) {
            const loadPublicNews = async () => {
              const coinsName = await loadCoinsName();
              const news = await loadNews(coinsName);
              setArticles(news.articles);
            };

            loadPublicNews();
          } else {
            const news = await loadNews(coinsName);

            if (news.articles.length === 0) {
              const loadPublicNews = async () => {
                const coinsName = await loadCoinsName();
                const news = await loadNews(coinsName);
                setArticles(news.articles);
              };

              loadPublicNews();
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
      const loadPublicNews = async () => {
        const coinsName = await loadCoinsName();
        const news = await loadNews(coinsName);
        setArticles(news.articles);
      };

      loadPublicNews();
    }
=======
    const loadNews = async () => {
      try {
        const result = await axios.get(
          "https://newsapi.org/v2/everything?q=(도지 OR 비트코인 OR 이더리움 OR 카르다노)&sortBy=publishedAt&apiKey=1dc00b247e534d808d5544eb92faef3e&language=ko"
        );
        setArticles(result.data.articles);
      } catch (error) {
        console.log(error);
      }
    };
    loadNews();
>>>>>>> 9be4ff1f06034c4d9bd5e76150135f096bd60df2
  }, []);

  return articles ? (
    <div className="newsContainer">
<<<<<<< HEAD
      {articles.map(
        ({ title, description, url, urlToImage, publishedAt }, index) => (
          <div className="newsItemContainer" key={index}>
            <div className="newsThumbnail">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={urlToImage} alt="thumbnail" />
=======
      {articles.map(({ title, description, url, urlToImage, publishedAt }) => (
        <div className="newsItemContainer" key={url}>
          <div className="newsThumbnail">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img src={urlToImage} alt="thumbnail" className="thumbnailImg" />
            </a>
            <p className="newsTitle">
              <a
                className="newsTitleLink"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
>>>>>>> 9be4ff1f06034c4d9bd5e76150135f096bd60df2
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
