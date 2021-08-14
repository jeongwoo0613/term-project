const getLocalToken = () => {
  if (localStorage.getItem("token")) {
    return JSON.parse(localStorage.getItem("token"));
  }

  return false;
};

const setLocalToken = (token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

const removeLocalToken = () => {
  localStorage.removeItem("token");
};

export { getLocalToken, setLocalToken, removeLocalToken };
