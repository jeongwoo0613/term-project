import "./Profile.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Loading from "../components/Loading";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import { useState, useEffect, useRef } from "react";
import {
  follow,
  getUser,
  getUserByUserId,
  unfollow,
  updateUser,
  updateUserImage,
} from "../api";
import { useHistory, useParams } from "react-router-dom";
import { getLocalToken, useAppContext } from "../utils";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

function Profile() {
  const [nickname, setNickname] = useState("");
  const [publicUser, setPublicUser] = useState();
  const [show, setShow] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isUnFollowLoading, setIsUnFollowLoading] = useState(false);
  const [followerShow, setFollowerShow] = useState(false);
  const [followShow, setFollowShow] = useState(false);
  const { user, setUser } = useAppContext();
  const { userId } = useParams();
  const history = useHistory();
  const fileRef = useRef();

  useEffect(() => {
    const loadPublicUser = async () => {
      try {
        const user = await getUserByUserId(userId);
        setPublicUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    loadPublicUser();

    const token = getLocalToken();

    if (token) {
      const loadUser = async () => {
        try {
          const user = await getUser(token);
          setUser(user);
          setNickname(user.nickname);
        } catch (error) {
          console.log(error);
        }
      };

      loadUser();
    }

    setIsFollowLoading(false);
    setIsUnFollowLoading(false);
  }, [isFollowLoading, isUnFollowLoading, userId, setUser]);

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    setIsEditLoading(true);

    try {
      const token = getLocalToken();

      if (!token) {
        return history.push("/login");
      }

      const modifiedUser = {
        nickname,
      };

      const updateResult = await updateUser(token, modifiedUser);

      if (!updateResult) {
        throw new Error("Update failed");
      }

      setIsEditLoading(false);

      if (modifiedUser.nickname !== user.nickname) {
        setUser({ ...user, nickname: modifiedUser.nickname });
        setShow(false);
      } else {
        setShow(false);
      }
    } catch (error) {
      if (error.message === "Update failed") {
        alert("?????? ?????? ?????? ??????????????????.");
      } else {
        alert("????????? ??????????????? ??? ??? ????????????. ?????? ??????????????????.");
      }
      setIsEditLoading(false);
    }
  };

  const handleFileClick = () => {
    fileRef.current.click();
  };

  const handleUploadImage = async (event) => {
    setIsUploadLoading(true);

    const file = event.target.files[0];

    if (file && file.size > 25000000) {
      alert(25000000 / 1000000 + "MB ????????? ????????? ???????????? ??? ????????????.");
      return;
    }

    const formData = new FormData();
    formData.append("userImage", file);

    try {
      const token = getLocalToken();

      if (!token) {
        return history.push("/login");
      }

      const updateImageResult = await updateUserImage(token, formData);

      if (!updateImageResult) {
        throw new Error("Update Image failed");
      }

      setUser({ ...user, image: updateImageResult });
      setIsUploadLoading(false);
      alert("????????? ???????????? ?????????????????????.");
    } catch (error) {
      if (error.message === "Update Image failed") {
        alert("????????? ???????????? ?????????????????????. ?????? ??????????????????.");
      }
      setIsUploadLoading(false);
    }
  };

  const handleFollow = async (event) => {
    event.preventDefault();

    try {
      const token = getLocalToken();

      if (!token) {
        return history.push("/login");
      }

      const followResult = await follow(token, {
        followingId: publicUser.id,
      });

      if (!followResult) {
        throw new Error("Follow failed");
      }

      setIsFollowLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnFollow = async (event) => {
    event.preventDefault();

    try {
      const token = getLocalToken();

      if (!token) {
        return history.push("/login");
      }

      const followResult = await unfollow(token, {
        followingId: publicUser.id,
      });

      if (!followResult) {
        throw new Error("Follow failed");
      }

      setIsUnFollowLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    return nickname.length > 0 && nickname !== user.nickname;
  };

  const validateEdit = () => {
    return getLocalToken() ? true : false;
  };

  const navigatePost = (coinId, postId) => {
    history.push(`/coins/${coinId}/posts/${postId}`);
  };

  const navigateUser = (userId) => {
    setFollowShow(false);
    setFollowerShow(false);
    history.push(`/${userId}`);
  };

  const navigateCoin = (coinId) => {
    history.push(`/coins/${coinId}`);
  };

  const token = getLocalToken();

  if (!token || user?.userId !== userId) {
    return publicUser ? (
      <section className="profileContainer">
        <div className="profileBox">
          <div className="profileImgDiv">
            <Image
              className="profileImg"
              src={publicUser.image}
              alt=""
              roundedCircle
            />
          </div>
          <div className="profileInfoDiv">
            <div className="profileHeader">
              <h3>{publicUser.nickname}</h3>
              {token ? (
                user?.following?.some((user) => user.id === publicUser.id) ? (
                  <Button
                    className="profileUnFollowBtn"
                    onClick={handleUnFollow}
                    size="sm"
                    variant="danger"
                  >
                    ????????????
                  </Button>
                ) : (
                  <Button
                    className="profileFollowBtn"
                    onClick={handleFollow}
                    size="sm"
                  >
                    ?????????
                  </Button>
                )
              ) : (
                <Button
                  className="profileFollowBtn"
                  onClick={handleFollow}
                  size="sm"
                >
                  ?????????
                </Button>
              )}
            </div>
            <div className="profileBody">
              <div className="profileBodyColPost">
                ????????? <strong>{publicUser.posts?.length}</strong>
              </div>
              <div
                className="profileBodyCol"
                onClick={() => setFollowerShow(true)}
              >
                ????????? <strong>{publicUser.followers?.length}</strong>
              </div>
              <Modal
                size="sm"
                show={followerShow}
                onHide={() => setFollowerShow(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>?????????</Modal.Title>
                </Modal.Header>
                {publicUser.followers?.map((follower) => (
                  <Modal.Body key={follower.id}>
                    <img src={follower.image} alt="" className="followImg" />
                    <span
                      className="navigateUser"
                      onClick={() => navigateUser(follower.userId)}
                    >
                      {follower.nickname}
                    </span>
                  </Modal.Body>
                ))}
              </Modal>
              <div
                className="profileBodyCol"
                onClick={() => setFollowShow(true)}
              >
                ????????? <strong>{publicUser.following?.length}</strong>
              </div>
              <Modal
                size="sm"
                show={followShow}
                onHide={() => setFollowShow(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>?????????</Modal.Title>
                </Modal.Header>
                {publicUser.following?.map((following) => (
                  <Modal.Body key={following.id}>
                    <img src={following.image} alt="" className="followImg" />
                    <span
                      className="navigateUser"
                      onClick={() => navigateUser(following.userId)}
                    >
                      {following.nickname}
                    </span>
                  </Modal.Body>
                ))}
              </Modal>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="post" className="profileTab">
          <Tab eventKey="post" title="?????????">
            <div className="profilePostsContainer">
              {publicUser.posts?.map((post) => (
                <Card
                  key={post.id}
                  className="profilePostsCard"
                  onClick={() => navigatePost(post.coin.id, post.id)}
                >
                  <Card.Header className="profilePostsCardHeader">
                    {post.title}
                    {post.rise ? (
                      <AiOutlineRise color="red" className="riseFallIcon" />
                    ) : (
                      <AiOutlineFall color="blue" className="riseFallIcon" />
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>{post.content}</Card.Text>
                    <Card.Text className="profilePostsCardInfo">
                      <img
                        alt=""
                        src={post.coin.image}
                        className="postCoinImg"
                      />
                      {post.coin.name}
                      <span className="profilePostsCardCreatedAt">
                        {`${new Date(post.createdAt).getFullYear()}??? ${
                          new Date(post.createdAt).getMonth() + 1
                        }??? ${new Date(post.createdAt).getDate()}???`}
                      </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Tab>
          <Tab eventKey="interestCoin" title="?????? ??????" disabled></Tab>
        </Tabs>
      </section>
    ) : (
      <Loading />
    );
  }

  return user ? (
    <section className="profileContainer">
      <div className="profileBox">
        <div className="profileImgDiv">
          <Image className="profileImg" src={user.image} alt="" roundedCircle />
        </div>
        <div className="profileInfoDiv">
          <div className="profileHeader">
            <h3>{user.nickname}</h3>
            <Button
              className="profileEditBtn"
              onClick={() => setShow(true)}
              size="sm"
              disabled={!validateEdit()}
            >
              ????????? ??????
            </Button>
            <Modal show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton />
              <Form onSubmit={handleUpdateUser}>
                <Modal.Body className="modalBody">
                  <div className="modalRow">
                    <div className="modalProfile">?????????</div>
                    <Image
                      className="modalProfileImage"
                      src={user.image}
                      alt=""
                      roundedCircle
                    />
                    <Form.Control
                      className="modalProfileImageInput"
                      type="file"
                      ref={fileRef}
                      onChange={handleUploadImage}
                    />
                    <Button size="sm" onClick={handleFileClick}>
                      {isUploadLoading ? (
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
                        "?????? ?????????"
                      )}
                    </Button>
                  </div>
                  <div className="modalRow">
                    <div className="modalNickname">?????????</div>
                    <Form.Group controlId="nickname">
                      <Form.Control
                        className="modalInputNickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button disabled={!validateForm()} type="submit" size="sm">
                    {isEditLoading ? (
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
                      "??????"
                    )}
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>
          <div className="profileBody">
            <div className="profileBodyColPost">
              ????????? <strong>{user.posts?.length}</strong>
            </div>
            <div
              className="profileBodyCol"
              onClick={() => setFollowerShow(true)}
            >
              ????????? <strong>{user.followers?.length}</strong>
            </div>
            <Modal
              size="sm"
              show={followerShow}
              onHide={() => setFollowerShow(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>?????????</Modal.Title>
              </Modal.Header>
              {user.followers?.map((follower) => (
                <Modal.Body key={follower.id}>
                  <img src={follower.image} alt="" className="followImg" />
                  <span
                    className="navigateUser"
                    onClick={() => navigateUser(follower.userId)}
                  >
                    {follower.nickname}
                  </span>
                </Modal.Body>
              ))}
            </Modal>
            <div className="profileBodyCol" onClick={() => setFollowShow(true)}>
              ????????? <strong>{user.following?.length}</strong>
            </div>
            <Modal
              size="sm"
              show={followShow}
              onHide={() => setFollowShow(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>?????????</Modal.Title>
              </Modal.Header>
              {user.following?.map((following) => (
                <Modal.Body key={following.id}>
                  <img src={following.image} alt="" className="followImg" />
                  <span
                    className="navigateUser"
                    onClick={() => navigateUser(following.userId)}
                  >
                    {following.nickname}
                  </span>
                </Modal.Body>
              ))}
            </Modal>
          </div>
        </div>
      </div>
      <Tabs defaultActiveKey="post" className="profileTab">
        <Tab eventKey="post" title="?????????">
          <div className="profilePostsContainer">
            {user.posts?.map((post) => (
              <Card
                key={post.id}
                className="profilePostsCard"
                onClick={() => navigatePost(post.coin.id, post.id)}
              >
                <Card.Header className="profilePostsCardHeader">
                  {post.title}
                  {post.rise ? (
                    <AiOutlineRise color="red" className="riseFallIcon" />
                  ) : (
                    <AiOutlineFall color="blue" className="riseFallIcon" />
                  )}
                </Card.Header>
                <Card.Body>
                  <Card.Text>{post.content}</Card.Text>
                  <Card.Text className="profilePostsCardInfo">
                    <img
                      alt=""
                      src={post.coin?.image}
                      className="postCoinImg"
                    />
                    {post.coin?.name}
                    <span className="profilePostsCardCreatedAt">
                      {`${new Date(post.createdAt).getFullYear()}??? ${
                        new Date(post.createdAt).getMonth() + 1
                      }??? ${new Date(post.createdAt).getDate()}???`}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Tab>
        <Tab eventKey="interestCoin" title="?????? ??????">
          <Table borderless className="profileCoinsTable">
            <thead>
              <tr>
                <th></th>
                <th>??????</th>
                <th>?????????</th>
                <th>?????????</th>
                <th>????????????</th>
                <th>????????????</th>
              </tr>
            </thead>
            <tbody>
              {user.interests?.map((coin) => (
                <tr
                  key={coin.id}
                  className="coinsTableRow"
                  onClick={() => navigateCoin(coin.id)}
                >
                  <td>
                    <img src={coin.image} alt="" width="25" height="25" />
                  </td>
                  <td>{coin.symbol}</td>
                  <td>
                    <strong>{coin.name}</strong>
                  </td>
                  <td
                    style={
                      coin.change === "RISE"
                        ? { color: "#ff3b30" }
                        : coin.change === "FALL"
                        ? { color: "#007aff" }
                        : { color: "" }
                    }
                  >
                    {Number(Number(coin.tradePrice).toFixed(2)).toLocaleString(
                      "en-US"
                    )}
                  </td>
                  <td
                    style={
                      coin.change === "RISE"
                        ? { color: "#ff3b30" }
                        : coin.change === "FALL"
                        ? { color: "#007aff" }
                        : { color: "" }
                    }
                  >
                    {coin.change === "RISE" ? "+" : ""}
                    {Number(
                      Number(
                        ((coin.tradePrice - coin.prevClosingPrice) /
                          coin.prevClosingPrice) *
                          100
                      ).toFixed(2)
                    ).toLocaleString("en-US") + "%"}
                  </td>
                  <td>
                    {Number(
                      Math.floor(coin.accTradePrice24h / 1000000).toFixed(2)
                    ).toLocaleString("en-US") + "??????"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </section>
  ) : (
    <Loading />
  );
}

export default Profile;
