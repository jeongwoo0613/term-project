import Form from "react-bootstrap/Form";
import { useFormFields } from "../utils/hooks.util";
import "./Comment.css";
import { useAppContext } from "../utils/context.util";

function Comment() {
  const [fields, setFields] = useFormFields({
    content: "",
  });
  const { user } = useAppContext();

  return (
    <div className="commentContainer">
      <h5 className="commentTitle">댓글</h5>
      <div className="commentImgContent">
        <img src={user.image} className="commentProfileImg" />
        <Form className="commentFormContainer">
          <div className="commentHeader">
            <div className="commentContent">
              <Form.Group controlId="content">
                <Form.Control
                  placeholder="댓글을 입력해주세요."
                  value={fields.content}
                  onChange={setFields}
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Comment;
