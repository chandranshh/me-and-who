import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    axios
      .get("https://chat-app-backend-nu.vercel.app/api/auth/profile")
      .then((response) => {
        setId(response.data.userId);
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
