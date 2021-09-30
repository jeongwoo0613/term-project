import "./Coins.css";
import Table from "react-bootstrap/Table";
import Loading from "./Loading";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCoins } from "../api";

function Coins() {
  const [coins, setCoins] = useState();
  const history = useHistory();

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coins = await getCoins();
        setCoins(coins);
      } catch (error) {
        console.log(error);
      }
    };
    loadCoins();
  }, []);

  const navigateCoin = (coinId) => {
    history.push(`/coins/${coinId}`);
  };

  return coins ? (
    <section>
      <Table borderless className="coinsTable">
        <thead>
          <tr>
            <th></th>
            <th>심볼</th>
            <th>코인명</th>
            <th>현재가</th>
            <th>전일대비</th>
            <th>거래대금</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr
              onClick={() => navigateCoin(coin.id)}
              key={coin.id}
              className="coinsTableRow"
            >
              <td>
                <img src={coin.image} alt="" width="25" height="25" />
              </td>
              <td>{coin.symbol}</td>
              <td>
                <strong>{coin.name}</strong>
              </td>
              <td
                style={
                  coin.change === "RISE"
                    ? { color: "#ff3b30" }
                    : coin.change === "FALL"
                    ? { color: "#007aff" }
                    : { color: "" }
                }
              >
                {Number(Number(coin.tradePrice).toFixed(2)).toLocaleString(
                  "en-US"
                )}
              </td>
              <td
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
              </td>
              <td>
                {Number(
                  Math.floor(coin.accTradePrice24h / 1000000).toFixed(2)
                ).toLocaleString("en-US") + "백만"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  ) : (
    <Loading />
  );
}

export default Coins;
