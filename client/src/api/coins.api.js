import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api"
      : "http://localhost:8080/api",
});

const getCoins = async () => {
  try {
    const result = await instance.get("/coins");

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const getCoin = async (coinId) => {
  try {
    const result = await instance.get(`/coins/${coinId}`);

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export { getCoins, getCoin };
