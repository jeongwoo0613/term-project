import "./Post.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/posts.api";
import Loading from "../components/Loading";
import Button from "react-bootstrap/Button";

function Post() {
  const [postData, setPostData] = useState();
  console.log(postData);
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
    <div className="postContainerDiv">
      <section className="postContainer">
        <div className="postHeader">
          <h5 className="postTitle">{postData.title}</h5>
        </div>
        <div className="postAuthorCreatedAt">
          <p className="postAuthor">
            <img className="postAuthorImg" src={postData.user.image} />
            {postData.user.nickname}
          </p>
        </div>
        <div className="postContentContainer">
          <p className="postContent">{postData.content}</p>
        </div>
        <div className="postCreatedAt">
          <p>작성일: {new Date(postData?.createdAt).toLocaleString("ko-kr")}</p>
          <div className="deleteEditBtnDiv">
            <Button className="editBtn">수정</Button>
            <Button variant="danger" className="deleteBtn">
              삭제
            </Button>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <Loading />
  );
}

export default Post;
