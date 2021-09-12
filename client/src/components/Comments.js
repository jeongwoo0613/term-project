import "./Comments.css";
import { useHistory } from "react-router-dom";

function Comments({ comments }) {
  const history = useHistory();

  const navigateUser = (userId) => {
    history.push(`/${userId}`);
  };
  return (
    <>
      {comments?.map((comment) => (
        <div className="commentsContainer" key={comment.id}>
          <div className="commentsImgContent">
            <img src={comment.user.image} className="commentsProfileImg" />
            <span
              className="commentsAuthor"
              onClick={() => navigateUser(comment.user.userId)}
            >
              {comment.user.nickname}
            </span>
          </div>
          <span className="commentsContent">{comment.content}</span>
          <div className="commentsEditDelete">
            <button className="commentsEdit">수정</button>
            <button className="commentsDelete">삭제</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default Comments;
