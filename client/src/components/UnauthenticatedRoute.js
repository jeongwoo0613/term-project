import { Route, Redirect } from "react-router-dom";
import { getLocalToken } from "../utils/storage.util";

function UnauthenticatedRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => (!getLocalToken() ? children : <Redirect to="/" />)}
    />
  );
}

export default UnauthenticatedRoute;
