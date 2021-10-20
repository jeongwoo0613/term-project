import "./Coin.css";
import Loading from "../components/Loading";
import Posts from "../components/Posts";
import { useState, useEffect } from "react";
import {
  getCoin,
  addInterestCoin,
  deleteInterestCoin,
  getPosts,
  getUser,
} from "../api";
import { useParams, useHistory } from "react-router-dom";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { getLocalToken } from "../utils";

function Coin() {
  const [coin, setCoin] = useState();
  const [posts, setPosts] = useState();
  const { coinId } = useParams();
  const [interest, setInterest] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const loadCoin = async () => {
      try {
        const coin = await getCoin(coinId);
        setCoin(coin);
      } catch (error) {
        console.log(error);
      }
    };

    loadCoin();

    const loadPosts = async () => {
      try {
        const posts = await getPosts(coinId);
        setPosts(posts);
      } catch (error) {
        console.log(error);
      }
    };

    loadPosts();

    const token = getLocalToken();

    if (token) {
      const loadUser = async () => {
        try {
          const user = await getUser(token);
          const interest = user.interests.some((coin) => coin.id === coinId);
          setInterest(interest);
        } catch (error) {
          console.log(error);
        }
      };

      loadUser();
    }
  }, [coinId]);

  const handleInterestCoin = async () => {
    const token = getLocalToken();

    if (!token) {
      return history.push("/login");
    }

    setInterest(true);

    try {
      const result = await addInterestCoin(token, coinId, {
        interest: true,
      });

      if (!result) {
        throw new Error("could not add interest coin");
      }
    } catch (error) {
      if (error.message === "could not add interest coin") {
        setInterest(false);
        alert("관심코인을 추가할 수 없습니다.");
      }
    }
  };

  const handleUnInterestCoin = async () => {
    const token = getLocalToken();

    if (!token) {
      return history.push("/login");
    }

    setInterest(false);

    try {
      const result = await deleteInterestCoin(token, coinId, {
        interest: false,
      });

      if (!result) {
        throw new Error("could not delete interest coin");
      }
    } catch (error) {
      if (error.message === "could not delete interest coin") {
        setInterest(true);
        alert("관심코인을 삭제할 수 없습니다.");
      }
    }
  };

  return coin ? (
    <section className="coinContainer">
      <div className="coinHeader">
        <img alt="" src={coin.image} />
        <h5 className="coinName">{coin.name}</h5>
        <h5>{coin.symbol}</h5>
        {interest ? (
          <AiFillStar className="fillStarIcon" onClick={handleUnInterestCoin} />
        ) : (
          <AiOutlineStar
            className="emptyStarIcon"
            onClick={handleInterestCoin}
          />
        )}
      </div>
      <div className="coinTradePrice">
        <p>현재가</p>
        <h5
          className="coinPrice"
          style={
            coin.change === "RISE"
              ? { color: "#ff3b30" }
              : coin.change === "FALL"
              ? { color: "#007aff" }
              : { color: "" }
          }
        >
          {Number(Number(coin.tradePrice).toFixed(2)).toLocaleString("en-US")}
        </h5>
        <p>전일대비</p>
        <h5
          className="coinChange"
          style={
            coin.change === "RISE"
              ? { color: "#ff3b30" }
              : coin.change === "FALL"
              ? { color: "#007aff" }
              : { color: "" }
          }
        >
          {coin.change === "RISE" ? "+" : ""}
          {Number(
            Number(
              ((coin.tradePrice - coin.prevClosingPrice) /
                coin.prevClosingPrice) *
                100
            ).toFixed(2)
          ).toLocaleString("en-US") + "%"}
        </h5>
      </div>
      <div className="coinDescriptionContainer">
        <h5>코인소개</h5>
        <p className="coinDescription">{coin.description}</p>
      </div>
      <div className="coinLinkContainer">
        <a
          className="coinLink"
          href={coin.homepage}
          target="_blank"
          rel="noreferrer"
        >
          웹사이트
        </a>
        <a
          className="coinLink"
          href={coin.github}
          target="_blank"
          rel="noreferrer"
        >
          저장소
        </a>
        <a
          className="coinLink"
          href={coin.whitepaper}
          target="_blank"
          rel="noreferrer"
        >
          백서
        </a>
      </div>
      <div className="coinMetaContainer">
        <div className="coinMeta">
          <span>
            <span className="coinMetaFont">최초발행</span> {coin.initialRelease}
          </span>
          <span className="coinSupplyLimit">
            <span className="coinMetaFont">총 발행한도</span> {coin.supplyLimit}
          </span>
        </div>
        <div className="coinAuthor">
          <span>
            <span className="coinMetaFont">개발자</span> {coin.author}
          </span>
        </div>
      </div>
      <Posts coinId={coinId} posts={posts} />
    </section>
  ) : (
    <Loading />
  );
}

export default Coin;
