import "./Posts.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

function Posts({ coinId, posts }) {
  const history = useHistory();

  const navigatePost = () => {
    history.push(`/coins/${coinId}/post/new`);
  };

  return (
    <div className="postsContainer">
      <Button onClick={navigatePost} className="postsBtn">
        글쓰기
      </Button>
      <div className="postsCardContainer">
        {posts
          ?.sort((a, b) => b.id - a.id)
          .map((post) => (
            <Card
              key={post.id}
              className="postsCard"
              onClick={() => history.push(`/coins/${coinId}/posts/${post.id}`)}
            >
              <Card.Header className="postsCardHeader">
                {post.title}
                {post.rise === true ? (
                  <AiOutlineRise color="red" className="riseFallIcon" />
                ) : (
                  <AiOutlineFall color="blue" className="riseFallIcon" />
                )}
              </Card.Header>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                <Card.Text className="postsCardInfo">
                  <img src={post.user.image} className="postsAuthorImg" />
                  {post.user.nickname}
                  <span className="postsCardCreatedAt">
                    {new Date(post.createdAt).toLocaleString("ko-kr")}
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
