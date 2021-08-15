import "./Posts.css";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

function Posts({ coinId }) {
  const history = useHistory();

  const handlePost = () => {
    history.push(`/coins/${coinId}/post/new`);
  };
  return (
    <div className="postsContainer">
      <Button onClick={handlePost} className="postsBtn">
        글쓰기
      </Button>
    </div>
  );
}

export default Posts;
