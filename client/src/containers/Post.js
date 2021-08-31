import "./Post.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/posts.api";
import Loading from "../components/Loading";

function Post() {
  const [postData, setPostData] = useState();
  const { coinId, postId } = useParams();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await getPost(coinId, postId);
        setPostData(post);
      } catch (error) {
        console.log(error);
      }
    };
    loadPost();
  }, []);

  return postData ? (
    <div>
      <h1>{postData.title}</h1>
      <h1>{postData.content}</h1>
      <h1>{postData.rise}</h1>
      <h1>{postData.fall}</h1>
      <h1>{postData.createdAt}</h1>
    </div>
  ) : (
    <Loading />
  );
}

export default Post;
