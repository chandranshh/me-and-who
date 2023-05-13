import React, { useContext, useState } from "react";
import { UserContext } from "../usercontext/UserContext";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  const setUsernameHandler = (e) => {
    setUsername(e.target.value);
  };

  const setPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("api/auth/register", {
        username: username,
        password: password,
      });

      setLoggedInUsername(username);
      setId(response.data._id);
    } catch (error) {
      console.log(error.message);
      console.log(error.config);
    }
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={setUsernameHandler}
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPasswordHandler}
          className="block w-full rounded-sm  p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2 mb-2">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
