import "./App.css";
import Routes from "./Routes";
import Header from "./components/Header";
import { AppContext } from "./utils/context.util";
import { useEffect, useState } from "react";
import { getLocalToken } from "./utils/storage.util";
import { getUser } from "./api/users.api";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    if (getLocalToken()) {
      const loadUser = async () => {
        try {
          const user = await getUser(getLocalToken());
          setUser(user);
        } catch (error) {
          console.log(error);
        }
      };
      loadUser();
    }
  }, []);

  return (
    <div className="appContainer">
      <AppContext.Provider value={{ user, setUser }}>
        <Header />
        <Routes />
      </AppContext.Provider>
    </div>
  );
}

export default App;
