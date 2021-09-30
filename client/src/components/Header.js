import "./Header.css";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { Link, useHistory, useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { getLocalToken, removeLocalToken, useAppContext } from "../utils";
import { searchCoin } from "../api";
import { useState } from "react";

function Header() {
  const [search, setSearch] = useState("");
  const history = useHistory();
  const location = useLocation();
  const { user } = useAppContext();

  const navigateLogin = () => {
    history.push("/login");
  };

  const navigateLogout = () => {
    removeLocalToken();
    history.push("/login");
  };

  const navigateProfile = () => {
    document.body.click();
    history.push(`/${user.userId}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await searchCoin(search);

      if (!result) {
        throw new Error("Coin not found");
      }
      setSearch("");
      history.push(`/coins/${result.id}`);
    } catch (error) {
      if (error.message === "Coin not found") {
        alert("해당 코인이 존재하지 않습니다.");
      }
      setSearch("");
    }
  };

  return (
    <header className="headerContainer">
      <div className="headerTop">
        <Link to="/">
          <h2 className="headerLogo">coinplus</h2>
        </Link>
        {!getLocalToken() ? (
          <Button onClick={navigateLogin} className="headerLogin">
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
                        onClick={navigateProfile}
                      >
                        프로필
                      </div>
                      <hr />
                      <div
                        className="headerUserLogout"
                        onClick={navigateLogout}
                      >
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
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="search">
            <Form.Control
              placeholder="코인 심볼, 코인명 검색"
              className="headerSearchInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
