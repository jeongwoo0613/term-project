import { useState, useContext, createContext } from "react";

const useFormFields = (initialState) => {
  const [fields, setFields] = useState(initialState);

  return [
    fields,
    (event) => {
      const { id, value } = event.target;
      setFields((prevFields) => ({
        ...prevFields,
        [id]: value,
      }));
    },
  ];
};

const AppContext = createContext();

const useAppContext = () => {
  return useContext(AppContext);
};

export { useFormFields, AppContext, useAppContext };
