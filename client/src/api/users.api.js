import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api"
      : "http://localhost:8080/api",
});

const getUsers = async () => {
  try {
    const result = await instance.get("/users");

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const getUserByUserId = async (userId) => {
  try {
    const result = await instance.get(`/users/${userId}`);

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (token) => {
  try {
    const result = await instance.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (token, user) => {
  try {
    const result = await instance.put("user", user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (token, user) => {
  try {
    const result = await instance.delete("user", user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const updateUserImage = async (token, image) => {
  try {
    const result = await instance.put(`/user/image`, image, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const follow = async (token, followingId) => {
  try {
    const result = await instance.put(`/user/follow`, followingId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const unfollow = async (token, followingId) => {
  try {
    const result = await instance.put(`/user/unfollow`, followingId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  getUsers,
  getUser,
  getUserByUserId,
  updateUser,
  deleteUser,
  updateUserImage,
  follow,
  unfollow,
};
