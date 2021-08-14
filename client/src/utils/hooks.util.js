import { useState } from "react";

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

export { useFormFields };
