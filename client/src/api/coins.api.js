import axios from "axios";
// TODO: seperate production and development environment
const instance = axios.create({
  baseURL: "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api",
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

const addInterestCoin = async (token, coinId, interest) => {
  try {
    const result = await instance.put(`/coins/${coinId}/interest`, interest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteInterestCoin = async (token, coinId, interest) => {
  try {
    const result = await instance.put(`/coins/${coinId}/uninterest`, interest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export { getCoins, getCoin, addInterestCoin, deleteInterestCoin };
