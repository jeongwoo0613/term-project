import axios from "axios";

const loadNews = async (name) => {
  try {
    const result = await axios.get(
      `https://newsapi.org/v2/everything?q=${name}&sortBy=publishedAt&apiKey=1dc00b247e534d808d5544eb92faef3e`
    );

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export { loadNews };
