import "./Trends.css";
import Loading from "../components/Loading";
import { Timeline } from "react-twitter-widgets";
import { useState, useEffect } from "react";
import { getLocalToken } from "../utils";
import { getCoins, getUser } from "../api";

function Trends() {
  const [coins, setCoins] = useState();

  useEffect(() => {
    if (getLocalToken()) {
      const loadCoinsForUser = async () => {
        try {
          const user = await getUser(getLocalToken());
          const coinsName = user.interests.map((coin) => coin.twitter);

          if (coinsName.length === 0) {
            const loadCoinsName = async () => {
              const coins = await getCoins();
              const filteredCoins = coins.filter(
                (coin) => coin.twitter !== null
              );
              const coinsName = filteredCoins.map((coin) => coin.twitter);
              setCoins(coinsName);
            };

            loadCoinsName();
          } else {
            setCoins(coinsName);
          }
        } catch (error) {
          console.log(error);
        }
      };

      loadCoinsForUser();
    } else {
      const loadCoinsName = async () => {
        const coins = await getCoins();
        const filteredCoins = coins.filter((coin) => coin.twitter !== null);
        const coinsName = filteredCoins.map((coin) => coin.twitter);
        setCoins(coinsName);
      };

      loadCoinsName();
    }
  }, []);

  return (
    <div className="trendsContainer">
      {coins ? (
        coins.map((trend, index) => (
          <div key={index}>
            <Timeline
              dataSource={{ sourceType: "profile", screenName: trend }}
              options={{ lang: "ko" }}
            />
          </div>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Trends;
