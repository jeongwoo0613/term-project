const getLocalToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return JSON.parse(token);
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
