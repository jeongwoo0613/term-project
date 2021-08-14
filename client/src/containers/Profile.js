import "./Profile.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Loading from "../components/Loading";
import Spinner from "react-bootstrap/Spinner";
import { useState, useEffect } from "react";
import {
  follow,
  getUser,
  getUserByUserId,
  unfollow,
  updateUser,
  updateUserImage,
} from "../api/users.api";
import { useHistory, useParams } from "react-router-dom";
import { getLocalToken } from "../utils/storage.util";
import { useRef } from "react";
import { useAppContext } from "../utils/context.util";

function Profile() {
  const [fieldsUserId, setFieldsUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [publicUser, setPublicUser] = useState();
  const { user, setUser } = useAppContext();
  const [show, setShow] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isUnFollowLoading, setIsUnFollowLoading] = useState(false);
  const history = useHistory();
  const { userId } = useParams();
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

    if (getLocalToken()) {
      const loadUser = async () => {
        try {
          const user = await getUser(getLocalToken());
          setUser(user);
          setFieldsUserId(user.userId);
          setNickname(user.nickname);
        } catch (error) {
          console.log(error);
        }
      };
      loadUser();
    }

    setIsFollowLoading(false);
    setIsUnFollowLoading(false);
  }, [isFollowLoading, isUnFollowLoading]);

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    setIsEditLoading(true);

    try {
      const modifiedUser = {
        userId: fieldsUserId,
        nickname,
      };

      const updateResult = await updateUser(getLocalToken(), modifiedUser);

      if (!updateResult) {
        throw new Error("Update failed");
      }

      setIsEditLoading(false);

      if (
        modifiedUser.userId !== user.userId &&
        modifiedUser.nickname !== user.nickname
      ) {
        setUser({
          ...user,
          userId: modifiedUser.userId,
          nickname: modifiedUser.nickname,
        });
        history.replace(`/${modifiedUser.userId}`);
        setShow(false);
      } else if (modifiedUser.userId !== user.userId) {
        setUser({ ...user, userId: modifiedUser.userId });
        history.replace(`/${modifiedUser.userId}`);
        setShow(false);
      } else if (modifiedUser.nickname !== user.nickname) {
        setUser({ ...user, nickname: modifiedUser.nickname });
        setShow(false);
      } else {
        setShow(false);
      }
    } catch (error) {
      if (error.message === "Update failed") {
        alert("이미 사용 중인 아이디입니다.");
      } else {
        alert("프로필 업데이트를 할 수 없습니다. 다시 시도해주세요.");
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
      alert(25000000 / 1000000 + "MB 이상의 파일을 업로드할 수 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("userImage", file);

    try {
      const updateImageResult = await updateUserImage(
        getLocalToken(),
        formData
      );

      if (!updateImageResult) {
        throw new Error("Update Image failed");
      }

      setUser({ ...user, image: updateImageResult });
      setIsUploadLoading(false);
    } catch (error) {
      if (error.message === "Update Image failed") {
        alert("이미지 업로드를 실패하였습니다. 다시 시도해주세요.");
      }
      setIsUploadLoading(false);
    }
  };

  const handleFollow = async (event) => {
    event.preventDefault();

    try {
      const followResult = await follow(getLocalToken(), {
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
      const followResult = await unfollow(getLocalToken(), {
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
    return (
      (fieldsUserId.length > 0 &&
        nickname.length > 0 &&
        fieldsUserId !== user.userId) ||
      nickname !== user.nickname
    );
  };

  const validateEdit = () => {
    return getLocalToken() ? true : false;
  };

  if (!getLocalToken() || user?.userId !== userId) {
    return publicUser ? (
      <section className="profileContainer">
        <div className="profileBox">
          <Image
            className="profileImg"
            src={publicUser.image}
            alt=""
            roundedCircle
          />
          <div>
            <div className="profileHeader">
              <h3>{publicUser.nickname}</h3>
              {user?.following.some((user) => user.id === publicUser.id) ? (
                <Button
                  className="profileUnFollowBtn"
                  onClick={handleUnFollow}
                  size="sm"
                  variant="danger"
                >
                  언팔로우
                </Button>
              ) : (
                <Button
                  className="profileFollowBtn"
                  onClick={handleFollow}
                  size="sm"
                >
                  팔로우
                </Button>
              )}
            </div>
            <div className="profileBody">
              <div className="profileBodyCol">
                게시물 <strong>{publicUser.posts.length}</strong>
              </div>
              <div className="profileBodyCol">
                팔로워 <strong>{publicUser.followers.length}</strong>
              </div>
              <div className="profileBodyCol">
                팔로우 <strong>{publicUser.following.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <Loading />
    );
  }

  return user ? (
    <section className="profileContainer">
      <div className="profileBox">
        <Image className="profileImg" src={user.image} alt="" roundedCircle />
        <div>
          <div className="profileHeader">
            <h3>{user.nickname}</h3>
            <Button
              className="profileEditBtn"
              onClick={() => setShow(true)}
              size="sm"
              disabled={!validateEdit()}
            >
              프로필 편집
            </Button>
            <Modal show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton />
              <Form onSubmit={handleUpdateUser}>
                <Modal.Body className="modalBody">
                  <div className="modalRow">
                    <div className="modalProfile">프로필</div>
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
                        "사진 업로드"
                      )}
                    </Button>
                  </div>
                  <div className="modalRow">
                    <div className="modalUserId">아이디</div>
                    <Form.Group controlId="userId">
                      <Form.Control
                        className="modalInputUserId"
                        value={fieldsUserId}
                        onChange={(e) => setFieldsUserId(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="modalRow">
                    <div className="modalNickname">닉네임</div>
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
                      "제출"
                    )}
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>
          <div className="profileBody">
            <div className="profileBodyCol">
              게시물 <strong>{user?.posts?.length}</strong>
            </div>
            <div className="profileBodyCol">
              팔로워 <strong>{user?.followers?.length}</strong>
            </div>
            <div className="profileBodyCol">
              팔로우 <strong>{user?.following?.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <Loading />
  );
}

export default Profile;
