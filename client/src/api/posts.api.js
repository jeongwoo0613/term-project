import axios from "axios";
// TODO: seperate production and development environment
const instance = axios.create({
  baseURL: "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api",
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

const deletePost = async (token, coinId, postId) => {
  try {
    const result = await instance.delete(`/${coinId}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const createComment = async (token, coinId, postId, comment) => {
  try {
    const result = await instance.post(
      `/${coinId}/posts/${postId}/comment`,
      comment,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const updateComment = async (token, coinId, postId, commentId, comment) => {
  try {
    const result = await instance.put(
      `/${coinId}/posts/${postId}/comments/${commentId}`,
      comment,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (token, coinId, postId, commentId) => {
  try {
    const result = await instance.delete(
      `/${coinId}/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
};
