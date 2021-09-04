import "./Header.css";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { Link, useHistory, useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { getLocalToken, removeLocalToken } from "../utils/storage.util";
import { useFormFields } from "../utils/hooks.util";
import { useAppContext } from "../utils/context.util";

function Header() {
  const [fields, setFields] = useFormFields({
    search: "",
  });
  const history = useHistory();
  const location = useLocation();
  const { user } = useAppContext();

  const handleLogin = () => {
    history.push("/login");
  };

  const handleLogout = () => {
    removeLocalToken();
    history.push("/login");
  };

  const handleProfile = () => {
    document.body.click();
    history.push(`/${user.userId}`);
  };

  return (
    <header className="headerContainer">
      <div className="headerTop">
        <Link to="/">
          <h2 className="headerLogo">coinplus</h2>
        </Link>
        {!getLocalToken() ? (
          <Button onClick={handleLogin} className="headerLogin" size="sm">
            로그인
          </Button>
        ) : (
          user && (
            <div className="headerUser">
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                rootClose
                overlay={
                  <Popover className="headerUserPopover">
                    <Popover.Body>
                      <div
                        className="headerUserProfile"
                        onClick={handleProfile}
                      >
                        프로필
                      </div>
                      <hr />
                      <div className="headerUserLogout" onClick={handleLogout}>
                        로그아웃
                      </div>
                    </Popover.Body>
                  </Popover>
                }
              >
                <Image
                  src={user.image}
                  alt=""
                  width="40"
                  height="40"
                  roundedCircle
                />
              </OverlayTrigger>
            </div>
          )
        )}
      </div>
      <div className="headerSearch">
        <Form>
          <Form.Group className="mb-3" controlId="search">
            <Form.Control
              placeholder="코인 심볼, 코인명 검색"
              className="headerSearchInput"
              value={fields.search}
              onChange={setFields}
              size="sm"
            />
          </Form.Group>
        </Form>
      </div>
      <Nav
        justify
        variant="tabs"
        className="headerNav"
        activeKey={location.pathname}
      >
        <Nav.Item>
          <LinkContainer exact to="/">
            <Nav.Link>홈</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/trends">
            <Nav.Link>코인동향</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/news">
            <Nav.Link>뉴스</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>
    </header>
  );
}

export default Header;
