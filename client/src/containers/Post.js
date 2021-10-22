import "./Post.css";
import Loading from "../components/Loading";
import Button from "react-bootstrap/Button";
import Comment from "../components/Comment";
import Comments from "../components/Comments";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { deletePost, getPost } from "../api";
import { getLocalToken, useAppContext } from "../utils";
import { AiOutlineRise, AiOutlineFall, AiOutlineRight } from "react-icons/ai";

function Post() {
  const [post, setPost] = useState();
  const { coinId, postId } = useParams();
  const history = useHistory();
  const { user } = useAppContext();

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
  }, [coinId, postId]);

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      const token = getLocalToken();

      if (!token) {
        return history.push("/login");
      }

      if (user.id !== post.user.id) {
        return alert("게시물 삭제 권한이 없습니다.");
      }

      const result = await deletePost(token, coinId, postId);

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
    const token = getLocalToken();

    if (!token) {
      return history.push("/login");
    }

    if (user.userId !== post.userId) {
      return alert("게시물 수정 권한이 없습니다.");
    }

    history.push(`/coins/${coinId}/posts/${postId}/edit`);
  };

  const navigateCoin = () => {
    history.push(`/coins/${coinId}`);
  };

  const navigateCoins = () => {
    history.push(`/`);
  };

  const navigateUser = () => {
    history.push(`/${post.user.userId}`);
  };

  return post ? (
    <section className="postContainer">
      <div className="postInfoContainer">
        <div className="postInfo">
          <span className="navigateCoin" onClick={navigateCoins}>
            암호화폐
          </span>
          <AiOutlineRight className="postInfoIcon" />
          <span className="navigateCoin" onClick={navigateCoin}>
            <img alt="" src={post.coin.image} className="postInfoCoinImg" />
            {post.coin.name}
          </span>
        </div>
      </div>
      <div className="postTitleContainer">
        <h5 className="postTitle">{post.title}</h5>
        <span className="postTitleRiseFall">
          {post.rise ? (
            <AiOutlineRise color="red" className="postTitleRiseFallIcon" />
          ) : (
            <AiOutlineFall color="blue" className="postTitleRiseFallIcon" />
          )}
        </span>
      </div>
      <div className="postAuthorContainer" onClick={navigateUser}>
        <img alt="" className="postAuthorImg" src={post.user.image} />
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
      <Comment coinId={coinId} postId={postId} setPost={setPost} post={post} />
      <Comments
        coinId={coinId}
        postId={postId}
        comments={post.comments}
        setPost={setPost}
      />
    </section>
  ) : (
    <Loading />
  );
}

export default Post;
