import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api"
      : "http://localhost:8080/api",
});

const getPosts = async () => {
  try {
    const result = await instance.get("/posts");

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (postId) => {
  try {
    const result = await instance.get(`/posts/${postId}`);

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const createPost = async (coinId, token, post) => {
  try {
    const result = await instance.post(`/${coinId}/post`, post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export { getPosts, getPost, createPost };
