import axios from "axios";
// TODO: seperate production and development environment
const instance = axios.create({
  baseURL: "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api",
});

const searchCoin = async (search) => {
  try {
    const result = await instance.get("/search", {
      params: {
        name: search,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export { searchCoin };
