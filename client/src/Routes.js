import { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Loading from "./components/Loading";

const Home = lazy(() => import("./containers/Home"));
const Coin = lazy(() => import("./containers/Coin"));
const Trends = lazy(() => import("./containers/Trends"));
const News = lazy(() => import("./containers/News"));
const Signup = lazy(() => import("./containers/Signup"));
const Login = lazy(() => import("./containers/Login"));
const Profile = lazy(() => import("./containers/Profile"));
const NotFound = lazy(() => import("./containers/NotFound"));
const NewPost = lazy(() => import("./containers/NewPost"));
const Post = lazy(() => import("./containers/Post"));
const EditPost = lazy(() => import("./containers/EditPost"));

function Routes() {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/trends">
          <Trends />
        </Route>
        <Route path="/news">
          <News />
        </Route>
        <UnauthenticatedRoute path="/signup">
          <Signup />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute path="/login">
          <Login />
        </UnauthenticatedRoute>
        <Route exact path="/:userId">
          <Profile />
        </Route>
        <AuthenticatedRoute path="/coins/:coinId/post/new">
          <NewPost />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/coins/:coinId/posts/:postId/edit">
          <EditPost />
        </AuthenticatedRoute>
        <Route path="/coins/:coinId/posts/:postId">
          <Post />
        </Route>
        <Route path="/coins/:coinId">
          <Coin />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
}

export default Routes;
