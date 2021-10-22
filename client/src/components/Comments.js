import "./Comments.css";
import { useHistory } from "react-router-dom";
import { getLocalToken, useAppContext } from "../utils";
import { getPost, deleteComment } from "../api";

function Comments({ coinId, postId, setPost, comments }) {
  const history = useHistory();
  const { user } = useAppContext();

  const navigateUser = (userId) => {
    history.push(`/${userId}`);
  };

  const handleDelete = async (event, commentId, commentUserId) => {
    event.preventDefault();

    try {
      const token = getLocalToken();

      if (!token) {
        return history.push("/login");
      }

      if (user.id !== commentUserId) {
        return alert("댓글 삭제 권한이 없습니다.");
      }

      const result = await deleteComment(token, coinId, postId, commentId);

      if (!result) {
        throw new Error("comment delete failed");
      }

      const post = await getPost(coinId, postId);

      setPost(post);
    } catch (error) {
      if (error.message === "comment delete failed") {
        alert("댓글 삭제를 실패하였습니다.");
      }
    }
  };

  return (
    <>
      {comments?.map((comment) => (
        <div className="commentsContainer" key={comment.id}>
          <div
            className="commentsImgContent"
            onClick={() => navigateUser(comment.user.userId)}
          >
            <img
              alt=""
              src={comment.user.image}
              className="commentsProfileImg"
            />
            <span className="commentsAuthor">{comment.user.nickname}</span>
          </div>
          <span className="commentsContent">{comment.content}</span>
          <div className="commentsEditDelete">
            <button className="commentsEdit">수정</button>
            <button
              onClick={(event) =>
                handleDelete(event, comment.id, comment.user.id)
              }
              className="commentsDelete"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default Comments;
