import "./Post.css";
import Loading from "../components/Loading";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { deletePost, getPost } from "../api/posts.api";
import { getLocalToken } from "../utils/storage.util";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

function Post() {
  const [postData, setPostData] = useState();
  const { coinId, postId } = useParams();
  const history = useHistory();

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

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      const result = await deletePost(getLocalToken(), coinId, postId);

      if (!result) {
        throw new Error("post delete failed");
      }

      history.replace(`/coins/${coinId}`);
    } catch (error) {
      if (error.message === "post delete failed") {
        alert("게시물 삭제를 실패하였습니다.");
      }
    }
  };

  const handleUpdate = () => {
    history.push(`/coins/${coinId}/posts/${postId}/edit`);
  };

  return postData ? (
    <section className="postContainer">
      <div className="postHeader">
        <h5 className="postTitle">{postData.title}</h5>
        <span className="postTitleCoinInfo">
          <img src={postData.coin.image} className="postTitleCoinImg" />
          {postData.coin.name}
          {postData.rise === true ? (
            <AiOutlineRise color="red" className="riseFallIcon" />
          ) : (
            <AiOutlineFall color="blue" className="riseFallIcon" />
          )}
        </span>
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
        <Button onClick={handleUpdate} className="editBtn">
          수정
        </Button>
        <Button onClick={handleDelete} variant="danger" className="deleteBtn">
          삭제
        </Button>
      </div>
    </section>
  ) : (
    <Loading />
  );
}

export default Post;
