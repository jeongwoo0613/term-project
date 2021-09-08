import "./Post.css";
import Loading from "../components/Loading";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { deletePost, getPost } from "../api/posts.api";
import { getLocalToken } from "../utils/storage.util";
import { AiOutlineRise, AiOutlineFall, AiOutlineRight } from "react-icons/ai";

function Post() {
  const [post, setPost] = useState();
  const { coinId, postId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await getPost(coinId, postId);
        setPost(post);
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

  return post ? (
    <section className="postContainer">
      <div className="postInfoContainer">
        <div className="postInfo">
          <span>암호화폐</span>
          <AiOutlineRight className="postInfoIcon" />
          <span>
            <img src={post.coin.image} className="postInfoCoinImg" />
            {post.coin.name}
          </span>
        </div>
      </div>
      <div className="postTitleContainer">
        <h5 className="postTitle">{post.title}</h5>
        <span className="postTitleRiseFall">
          {post.rise === true ? (
            <AiOutlineRise color="red" className="postTitleRiseFallIcon" />
          ) : (
            <AiOutlineFall color="blue" className="postTitleRiseFallIcon" />
          )}
        </span>
      </div>
      <div className="postAuthorContainer">
        <img className="postAuthorImg" src={post.user.image} />
        {post.user.nickname}
      </div>
      <div className="postContentContainer">
        <p className="postContent">{post.content}</p>
      </div>
      <div className="postCreatedAt">
        <p>{`${new Date(post.createdAt).getFullYear()}년 ${
          new Date(post.createdAt).getMonth() + 1
        }월 ${new Date(post.createdAt).getDate()}일`}</p>
      </div>
      <div className="postEditAndDeleteContainer">
        <Button onClick={handleUpdate} className="postEditBtn">
          수정
        </Button>
        <Button
          onClick={handleDelete}
          variant="danger"
          className="postDeleteBtn"
        >
          삭제
        </Button>
      </div>
    </section>
  ) : (
    <Loading />
  );
}

export default Post;
