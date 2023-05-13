import React from "react";
import Register from "./components/register/Register";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;

  return (
    <div>
      <Register />
    </div>
  );
}

export default App;
