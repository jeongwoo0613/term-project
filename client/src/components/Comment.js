import "./Comment.css";
import Form from "react-bootstrap/Form";
import { useAppContext, getLocalToken } from "../utils";
import { getPost, createComment } from "../api";
import { useState } from "react";

function Comment({ coinId, postId, setPost, post }) {
  const { user } = useAppContext();
  const [content, setContent] = useState("");

  const handleEnter = async (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      try {
        const result = await createComment(getLocalToken(), coinId, postId, {
          content,
        });

        if (!result) {
          throw new Error("Comment creation failed");
        }

        const post = await getPost(coinId, postId);

        setPost(post);
        setContent("");
      } catch (error) {
        if (error.message === "Comment creation failed") {
          alert("댓글 생성을 실패하였습니다.");
        }
      }
    }
  };

  return (
    <div className="commentContainer">
      <h5 className="commentHeader">댓글 {post.comments.length}</h5>
      <div className="commentImgContent">
        <img src={user.image} className="commentProfileImg" />
        <Form className="commentFormContainer">
          <Form.Group controlId="content">
            <Form.Control
              placeholder="댓글을 입력해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleEnter}
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default Comment;
