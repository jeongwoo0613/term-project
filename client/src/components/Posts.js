import "./Posts.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

function Posts({ coinId, posts }) {
  const history = useHistory();

  const navigateNewPost = () => {
    history.push(`/coins/${coinId}/post/new`);
  };

  const navigatePost = (postId) => {
    history.push(`/coins/${coinId}/posts/${postId}`);
  };

  return (
    <div className="postsContainer">
      <Button onClick={navigateNewPost} className="postsBtn">
        글쓰기
      </Button>
      <div className="postsCardContainer">
        {posts?.map((post) => (
          <Card
            key={post.id}
            className="postsCard"
            onClick={() => navigatePost(post.id)}
          >
            <Card.Header className="postsCardHeader">
              {post.title}
              {post.rise ? (
                <AiOutlineRise color="red" className="riseFallIcon" />
              ) : (
                <AiOutlineFall color="blue" className="riseFallIcon" />
              )}
            </Card.Header>
            <Card.Body>
              <Card.Text>{post.content}</Card.Text>
              <Card.Text className="postsCardInfo">
                <img alt="" src={post.user.image} className="postsAuthorImg" />
                {post.user.nickname}
                <span className="postsCardCreatedAt">
                  {`${new Date(post.createdAt).getFullYear()}년 ${
                    new Date(post.createdAt).getMonth() + 1
                  }월 ${new Date(post.createdAt).getDate()}일`}
                </span>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Posts;
