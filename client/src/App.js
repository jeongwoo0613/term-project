import "./App.css";
import Routes from "./Routes";
import Header from "./components/Header";
import { AppContext, getLocalToken } from "./utils";
import { getUser } from "./api";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const token = getLocalToken();

    if (token) {
      const loadUser = async () => {
        try {
          const user = await getUser(token);
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
