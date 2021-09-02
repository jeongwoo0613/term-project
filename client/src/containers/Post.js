import "./Post.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/posts.api";
import Loading from "../components/Loading";
import Button from "react-bootstrap/Button";

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
    <section className="postContainer">
      <div className="postHeader">
        <h5 className="postTitle">{postData.title}</h5>
      </div>
      <div className="postAuthorContainer">
        <img className="postAuthorImg" src={postData.user.image} />
        {postData.user.nickname}
      </div>
      <div className="postContentContainer">
        <p className="postContent">{postData.content}</p>
      </div>
      <div className="postCreatedAt">
        <p>{new Date(postData.createdAt).toLocaleString("ko-kr")}</p>
      </div>
      <div className="editAndDeleteBtn">
        <Button className="editBtn">수정</Button>
        <Button variant="danger" className="deleteBtn">
          삭제
        </Button>
      </div>
    </section>
  ) : (
    <Loading />
  );
}

export default Post;
