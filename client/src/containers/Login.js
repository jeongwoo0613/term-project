import "./Login.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { FcGoogle } from "react-icons/fc";
import { useFormFields, setLocalToken, useAppContext } from "../utils";
import { authLogin } from "../api";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Login() {
  const [fields, setFields] = useFormFields({
    userId: "",
    password: "",
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const refUserId = useRef();
  const refPassword = useRef();
  const { setUser } = useAppContext();
  const { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    const parsed = Object.fromEntries(new URLSearchParams(location.search));

    if (parsed.token && parsed.user) {
      setLocalToken(parsed.token);
      setUser(JSON.parse(parsed.user));
      history.replace(from);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoginLoading(true);

    try {
      const loginResult = await authLogin({
        userId: fields.userId,
        password: fields.password,
      });

      if (!loginResult) {
        throw new Error("Login failed");
      }

      setIsLoginLoading(false);
      setLocalToken(loginResult.token);
      setUser(loginResult.user);
      history.replace(from);
    } catch (error) {
      if (error.message === "Login failed") {
        setError(true);
        refUserId.current.focus();
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
      setIsLoginLoading(false);
    }
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      switch (event.target.id) {
        case "userId":
          refPassword.current.focus();
          break;
        default:
          break;
      }
    }
  };
  // TODO: seperate production and development environment
  const handleGoogle = async () => {
    window.open(
      "http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api/auth/google",
      "_self"
    );
  };

  const validateForm = () => {
    return fields.userId.length > 0 && fields.password.length > 0;
  };

  return (
    <div className="loginContainer">
      <Form onSubmit={handleSubmit}>
        <h2 className="loginFormLogo">coinplus</h2>
        <Form.Group className="mb-3" controlId="userId">
          <Form.Control
            placeholder="아이디"
            autoFocus
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
        {error && (
          <Alert variant="danger">아이디와 비빌번호가 일치하지 않습니다.</Alert>
        )}
        <Button
          disabled={!validateForm()}
          type="submit"
          className="loginBtn"
          size="sm"
        >
          {isLoginLoading ? (
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
            "로그인"
          )}
        </Button>
      </Form>
      <div className="hr-sect">또는</div>
      <button onClick={handleGoogle} className="mb-3 googleLoginBtn">
        <FcGoogle size="1.25em" className="googleIcon" /> Google로 로그인
      </button>
      <Link to="/signup" className="linkSignup">
        아직 회원이 아니신가요?
      </Link>
    </div>
  );
}

export default Login;
