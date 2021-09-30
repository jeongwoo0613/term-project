import { Route, Redirect } from "react-router-dom";
import { getLocalToken } from "../utils";

function UnauthenticatedRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => (!getLocalToken() ? children : <Redirect to="/" />)}
    />
  );
}

export default UnauthenticatedRoute;
