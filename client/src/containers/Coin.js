import "./Coin.css";
import Loading from "../components/Loading";
import Posts from "../components/Posts";
import { useState, useEffect } from "react";
import { getCoin } from "../api/coins.api";
import { useParams } from "react-router-dom";
import { getPosts } from "../api/posts.api";

function Coin() {
  const [coinData, setCoinData] = useState();
  const [postsData, setPostsData] = useState();
  const { coinId } = useParams();

  useEffect(() => {
    const loadCoin = async () => {
      try {
        const coin = await getCoin(coinId);
        setCoinData(coin);
      } catch (error) {
        console.log(error);
      }
    };
    loadCoin();
    const loadPosts = async () => {
      try {
        const posts = await getPosts(coinId);
        setPostsData(posts);
      } catch (error) {
        console.log(error);
      }
    };
    loadPosts();
  }, []);

  return coinData ? (
    <div className="coinContainerDiv">
      <section className="coinContainer">
        <div className="coinHeader">
          <img src={coinData.image} />
          <h5 className="coinName">{coinData.name}</h5>
          <h5>{coinData.symbol}</h5>
        </div>
        <div className="coinTradePrice">
          <p>현재가</p>
          <h5
            className="coinPrice"
            style={
              coinData.change === "RISE"
                ? { color: "#ff3b30" }
                : coinData.change === "FALL"
                ? { color: "#007aff" }
                : { color: "" }
            }
          >
            {Number(Number(coinData.tradePrice).toFixed(2)).toLocaleString(
              "en-US"
            )}
          </h5>
          <p>전일대비</p>
          <h5
            className="coinChange"
            style={
              coinData.change === "RISE"
                ? { color: "#ff3b30" }
                : coinData.change === "FALL"
                ? { color: "#007aff" }
                : { color: "" }
            }
          >
            {coinData.change === "RISE" ? "+" : ""}
            {Number(
              Number(
                ((coinData.tradePrice - coinData.prevClosingPrice) /
                  coinData.prevClosingPrice) *
                  100
              ).toFixed(2)
            ).toLocaleString("en-US") + "%"}
          </h5>
        </div>
        <div className="coinDescriptionContainer">
          <h5>코인소개</h5>
          <p className="coinDescription">{coinData.description}</p>
        </div>
        <div className="coinLinkContainer">
          <a
            className="coinLink"
            href={coinData.homepage}
            target="_blank"
            rel="noreferrer"
          >
            웹사이트
          </a>
          <a
            className="coinLink"
            href={coinData.github}
            target="_blank"
            rel="noreferrer"
          >
            저장소
          </a>
          <a
            className="coinLink"
            href={coinData.whitepaper}
            target="_blank"
            rel="noreferrer"
          >
            백서
          </a>
        </div>
        <div className="coinMetaContainer">
          <div className="coinMeta">
            <span>
              <span className="coinMetaFont">최초발행</span>{" "}
              {coinData.initialRelease}
            </span>
            <span className="coinSupplyLimit">
              <span className="coinMetaFont">총 발행한도</span>{" "}
              {coinData.supplyLimit}
            </span>
          </div>
          <div className="coinAutor">
            <span>
              <span className="coinMetaFont">개발자</span> {coinData.author}
            </span>
          </div>
        </div>
        <Posts coinId={coinId} posts={postsData} />
      </section>
    </div>
  ) : (
    <Loading />
  );
}
export default Coin;
