import axios, { AxiosResponse } from "axios";
import { Coin } from "../entities/coin.entity";

interface IUpbitCoinPrice {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: string;
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

interface IUpbitCoinsPrice {
  [key: string]: IUpbitCoinPrice;
}

const instance = axios.create({
  baseURL: "https://api.upbit.com/v1",
});

const getUpbitCoinsPrice = async (
  coins: Coin[]
): Promise<IUpbitCoinsPrice | undefined> => {
  try {
    const upbitCoinsPrice = await Promise.all(
      coins.reduce((acc, coin) => {
        acc.push(
          instance.get<IUpbitCoinPrice[]>("/ticker", {
            params: { markets: coin.market },
          })
        );

        return acc;
      }, [] as Promise<AxiosResponse<IUpbitCoinPrice[]>>[])
    );

    return upbitCoinsPrice.reduce((acc, coin, i) => {
      acc[coins[i].symbol] = coin.data[0];

      return acc;
    }, {} as IUpbitCoinsPrice);
  } catch (error) {
    console.log(error);
  }
};

const getUpbitCoinPrice = async (
  market: string
): Promise<IUpbitCoinPrice | undefined> => {
  try {
    const result = await instance.get<IUpbitCoinPrice[]>("/ticker", {
      params: { markets: market },
    });

    const upbitCoinPrice = result.data[0];

    return upbitCoinPrice;
  } catch (error) {
    console.log(error);
  }
};

export { getUpbitCoinsPrice, getUpbitCoinPrice };
