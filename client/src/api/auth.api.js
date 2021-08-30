import axios from "axios";
// TODO: seperate production and development environment
const instance = axios.create({
  baseURL: "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api",
});

const authSignup = async (user) => {
  try {
    const result = await instance.post("/auth/signup", user);

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const authLogin = async (user) => {
  try {
    const result = await instance.post("/auth/login", user);

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export { authSignup, authLogin };
