import "./Loading.css";
import Spinner from "react-bootstrap/Spinner";

function Loading() {
  return (
    <div className="loadingContainer">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loading;
