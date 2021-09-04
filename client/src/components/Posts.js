import "./Posts.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";

function Posts({ coinId, posts }) {
  const history = useHistory();

  const navigatePost = () => {
    history.push(`/coins/${coinId}/post/new`);
  };

  return (
    <div className="postsContainer">
      <Button onClick={navigatePost} className="postsBtn" size="sm">
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
              </Card.Header>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                <Card.Text className="postsCardCreatedAt">
                  {new Date(post?.createdAt).toLocaleString("ko-kr")}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default Posts;
