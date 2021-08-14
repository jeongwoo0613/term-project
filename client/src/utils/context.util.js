import { useContext, createContext } from "react";

const AppContext = createContext();

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContext, useAppContext };
