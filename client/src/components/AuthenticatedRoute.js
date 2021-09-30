import { Route, Redirect } from "react-router-dom";
import { getLocalToken } from "../utils";

function AuthenticatedRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        getLocalToken() ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    />
  );
}

export default AuthenticatedRoute;
