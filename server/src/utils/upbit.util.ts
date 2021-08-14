import axios, { AxiosResponse } from "axios";
import { Coin } from "../entities/coin.entity";

interface ICoinsPrice {
  [key: string]: AxiosResponse<any>;
}

const instance = axios.create({
  baseURL: "https://api.upbit.com/v1",
});

const getUpbitCoinsPrice = async (coins: Coin[]): Promise<any> => {
  try {
    const result: Promise<AxiosResponse<any>>[] = [];
    const upbitCoinsPrice = await Promise.all(
      coins.reduce((acc, coin) => {
        acc.push(instance.get("/ticker", { params: { markets: coin.market } }));

        return acc;
      }, result)
    );

    const coinsPrice: ICoinsPrice = {};
    return upbitCoinsPrice.reduce((acc, coin, i) => {
      acc[coins[i].symbol] = coin.data;

      return acc;
    }, coinsPrice);
  } catch (error) {
    console.log(error);
  }
};

const getUpbitCoinPrice = async (market: string): Promise<any> => {
  try {
    const result = await instance.get("/ticker", {
      params: { markets: market },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export { getUpbitCoinsPrice, getUpbitCoinPrice };
