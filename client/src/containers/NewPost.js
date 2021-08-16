import "./NewPost.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormFields } from "../utils/hooks.util";
import { createPost } from "../api/posts.api";
import { getLocalToken } from "../utils/storage.util";

function NewPost() {
  const [fields, setFields] = useFormFields({
    title: "",
    contetnt: "",
  });
  const [rise, setRise] = useState(false);
  const [fall, setFall] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory();
  const refTitle = useRef();
  const refContent = useRef();
  const { coinId } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPostLoading(true);

    try {
      const postResult = await createPost(coinId, getLocalToken(), {
        title: fields.title,
        content: fields.content,
        rise,
        fall,
      });

      if (!postResult) {
        throw new Error("Post creation failed");
      }

      setIsPostLoading(false);
      history.replace(`/coins/${coinId}`);
    } catch (error) {
      if (error.message === "Post creation failed") {
        setError(true);
        refTitle.current.focus();
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
      setIsPostLoading(false);
    }
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      switch (event.target.id) {
        case "title":
          refContent.current.focus();
          break;
        default:
          break;
      }
    }
  };

  const validateForm = () => {
    return (
      fields.title.length > 0 && fields.content.length > 0 && (rise || fall)
    );
  };

  const handleRise = () => {
    setRise(true);
    setFall(false);
  };

  const handleFall = () => {
    setFall(true);
    setRise(false);
  };

  return (
    <Form className="newPostFormContainer" onSubmit={handleSubmit}>
      <Form.Group controlId="title">
        <Form.Control
          placeholder="제목을 입력해주세요."
          autoFocus
          value={fields.title}
          onChange={setFields}
          onKeyDown={handleEnter}
          ref={refTitle}
        />
      </Form.Group>
      <Button
        variant={rise ? "danger" : "outline-danger"}
        className="riseBtn"
        onClick={handleRise}
      >
        오른다
      </Button>
      <Button
        variant={fall ? "primary" : "outline-primary"}
        className="fallBtn"
        onClick={handleFall}
      >
        내린다
      </Button>
      <Form.Group controlId="content">
        <Form.Control
          placeholder="내용을 입력해주세요."
          value={fields.content}
          onChange={setFields}
          ref={refContent}
          as="textarea"
        />
      </Form.Group>
      {error && alert("제목을 1 ~ 30자, 내용을 1 ~ 300자를 입력해주세요.")}
      <Button
        disabled={!validateForm()}
        type="submit"
        className="postBtn"
        size="sm"
      >
        {isPostLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
              size="sm"
            />
            <span className="visually-hidden">Loading...</span>
          </>
        ) : (
          "제출하기"
        )}
      </Button>
    </Form>
  );
}

export default NewPost;
