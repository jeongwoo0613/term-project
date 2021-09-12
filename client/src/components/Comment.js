import "./Comment.css";
import Form from "react-bootstrap/Form";
import { useFormFields } from "../utils/hooks.util";
import { useAppContext } from "../utils/context.util";
import { createComment } from "../api/posts.api";
import { getLocalToken } from "../utils/storage.util";

function Comment({ coinId, postId }) {
  const [fields, setFields] = useFormFields({
    content: "",
  });
  const { user } = useAppContext();

  const handleEnter = async (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      try {
        const result = await createComment(getLocalToken(), coinId, postId, {
          content: fields.content,
        });

        if (!result) {
          throw new Error("Comment creation failed");
        }
      } catch (error) {
        if (error.message === "Comment creation failed") {
          alert("댓글 생성을 실패하였습니다.");
        }
      }
    }
  };

  return (
    <div className="commentContainer">
      <h5 className="commentHeader">댓글</h5>
      <div className="commentImgContent">
        <img src={user.image} className="commentProfileImg" />
        <Form className="commentFormContainer">
          <Form.Group controlId="content">
            <Form.Control
              placeholder="댓글을 입력해주세요."
              value={fields.content}
              onChange={setFields}
              onKeyDown={handleEnter}
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default Comment;
