import "./Trends.css";
import Loading from "../components/Loading";
import { Timeline } from "react-twitter-widgets";
import { useState, useEffect } from "react";
import { getLocalToken } from "../utils";
import { getCoins, getUser } from "../api";

function Trends() {
  const [coins, setCoins] = useState();

  const loadCoinsTwitter = async () => {
    const coins = await getCoins();
    const coinsTwitter = coins
      .filter((coin) => coin.twitter !== null)
      .map((coin) => coin.twitter);

    setCoins(coinsTwitter);
  };

  useEffect(() => {
    const token = getLocalToken();

    if (token) {
      const loadInterestCoinsTwitterForUser = async () => {
        try {
          const user = await getUser(token);
          const interestCoinsTwitter = user.interests.map((coin) => {
            return coin.twitter;
          });

          if (interestCoinsTwitter.length === 0) {
            loadCoinsTwitter();
          } else {
            setCoins(interestCoinsTwitter);
          }
        } catch (error) {
          console.log(error);
        }
      };

      loadInterestCoinsTwitterForUser();
    } else {
      loadCoinsTwitter();
    }
  }, []);

  return (
    <div className="trendsContainer">
      {coins ? (
        coins.map((coin, index) => (
          <Timeline
            dataSource={{ sourceType: "profile", screenName: coin }}
            options={{ lang: "ko" }}
            key={index}
          />
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Trends;
