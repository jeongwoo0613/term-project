import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api"
      : "http://localhost:8080/api",
});

const createPost = async (token, coinId, post) => {
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

const getPosts = async (coinId) => {
  try {
    const result = await instance.get(`/${coinId}/posts`);

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (coinId, postId) => {
  try {
    const result = await instance.get(`/${coinId}/posts/${postId}`);

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const updatePost = async (token, coinId, postId, post) => {
  try {
    const result = await instance.put(`/${coinId}/posts/${postId}`, post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (token, coinId, postId, post) => {
  try {
    const result = await instance.delete(`/${coinId}/posts/${postId}`, post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export { getPosts, getPost, createPost, updatePost, deletePost };
