import React from "react";
import axios from "axios";
import { UserContextProvider } from "./components/usercontext/UserContext";
import Routes from "./components/routes/Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
