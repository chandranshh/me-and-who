import React, { useContext } from "react";
import Register from "../register/Register";
import { UserContext } from "../usercontext/UserContext";

function Routes() {
  const { username, id } = useContext(UserContext);

  if (username) {
    return `logged in + ${username} + ${id}`;
  }

  return (
    <div>
      <Register />
    </div>
  );
}

export default Routes;
