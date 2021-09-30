import "./Signup.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useFormFields, useAppContext, setLocalToken } from "../utils";
import { authLogin, authSignup } from "../api";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useState, useRef } from "react";

function Signup() {
  const [fields, setFields] = useFormFields({
    nickname: "",
    userId: "",
    password: "",
  });
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const refUserId = useRef();
  const refPassword = useRef();
  const { setUser } = useAppContext();
  const { from } = location.state || { from: { pathname: "/" } };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isNicknameValid =
      fields.nickname.length >= 1 && fields.nickname.length <= 30;
    if (!isNicknameValid) {
      return alert("닉네임은 1 ~ 30자 이어야 합니다.");
    }

    const isUserIdValid =
      /^[a-z0-9]+$/.test(fields.userId) &&
      fields.userId.length >= 4 &&
      fields.userId.length <= 16;
    if (!isUserIdValid) {
      return alert("아이디는 영문 소문자, 숫자 포함 4 ~ 16자 이어야 합니다.");
    }

    const isPasswordValid = /(?=.*[0-9])(?=.*[a-z])(?=.*[^0-9a-zA-Z])/.test(
      fields.password
    );
    if (!isPasswordValid) {
      return alert(
        "비밀번호는 영문, 숫자, 특수문자가 반드시 포함되어야 합니다."
      );
    }

    setIsSignupLoading(true);

    try {
      const signupResult = await authSignup({
        nickname: fields.nickname,
        userId: fields.userId,
        password: fields.password,
      });

      if (!signupResult) {
        throw new Error("signup failed");
      }

      const loginResult = await authLogin({
        userId: fields.userId,
        password: fields.password,
      });

      setIsSignupLoading(false);
      setLocalToken(loginResult.token);
      setUser(loginResult.user);
      history.replace(from);
    } catch (error) {
      if (error.message === "signup failed") {
        setError(true);
        refUserId.current.focus();
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
      setIsSignupLoading(false);
    }
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      switch (event.target.id) {
        case "nickname":
          refUserId.current.focus();
          break;
        case "userId":
          refPassword.current.focus();
          break;
        default:
          break;
      }
    }
  };

  const validateForm = () => {
    return fields.userId.length > 0 && fields.password.length > 0;
  };

  return (
    <div className="signupContainer">
      <Form onSubmit={handleSubmit}>
        <h2 className="signupFormLogo">coinplus</h2>
        <Form.Group className="mb-3" controlId="nickname">
          <Form.Control
            placeholder="닉네임"
            autoFocus
            value={fields.nickname}
            onChange={setFields}
            onKeyDown={handleEnter}
            size="sm"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="userId">
          <Form.Control
            placeholder="아이디"
            value={fields.userId}
            onChange={setFields}
            onKeyDown={handleEnter}
            ref={refUserId}
            size="sm"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Control
            type="password"
            placeholder="비밀번호"
            value={fields.password}
            onChange={setFields}
            ref={refPassword}
            size="sm"
          />
        </Form.Group>
        {error && <Alert variant="danger">이미 아이디가 존재합니다.</Alert>}
        <Button
          disabled={!validateForm()}
          type="submit"
          className="mb-3 signupBtn"
          size="sm"
        >
          {isSignupLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </>
          ) : (
            "회원가입"
          )}
        </Button>
        <Link className="linkLogin" to="/login">
          이미 회원이신가요?
        </Link>
      </Form>
    </div>
  );
}

export default Signup;
