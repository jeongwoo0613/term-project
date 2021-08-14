import "./Trends.css";
import { Timeline } from "react-twitter-widgets";

function Trends() {
  return (
    <div className="trendsContainer">
      {[
        "Bitcoin",
        "dogecoin",
        "ethereum",
        "Ripple",
        "EOSIO",
        "Cardano",
        "StellarOrg",
        "chainlink",
        "Polkadot",
        "elonmusk",
        "jack",
      ].map((trend) => (
        <>
          <Timeline
            dataSource={{ sourceType: "profile", screenName: trend }}
            options={{ lang: "ko" }}
          />
        </>
      ))}
    </div>
  );
}

export default Trends;
