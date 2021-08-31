import "./Posts.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";

function Posts({ coinId, posts }) {
  const history = useHistory();

  const handlePost = () => {
    history.push(`/coins/${coinId}/post/new`);
  };
  return (
    <div className="postsContainer">
      <Button onClick={handlePost} className="postsBtn">
        글쓰기
      </Button>
      <div className="postsDiv">
        {posts
          ?.sort((a, b) => b.id - a.id)
          .map((post) => (
            <Card
              key={post.id}
              className="postsCard"
              style={
                post.rise
                  ? { borderColor: "#E09099" }
                  : post.fall
                  ? { borderColor: "#8689FA" }
                  : { borderColor: "" }
              }
            >
              <Card.Header
                style={
                  post.rise
                    ? { backgroundColor: "#E09099" }
                    : post.fall
                    ? { backgroundColor: "#8689FA" }
                    : { borderColor: "" }
                }
              >
                {post.title}
              </Card.Header>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                <Card.Text className="postsCardCreatedAt">
                  {post.createdAt.substr(0, 10)}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default Posts;
