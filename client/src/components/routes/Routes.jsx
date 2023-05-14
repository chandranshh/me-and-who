import React, { useContext } from "react";
import RegisterAndLoginForm from "../register/RegisterAndLoginForm";
import { UserContext } from "../usercontext/UserContext";

function Routes() {
  const { username, id } = useContext(UserContext);

  if (username) {
    return `logged in + ${username} + ${id}`;
  }

  return (
    <div>
      <RegisterAndLoginForm />
    </div>
  );
}

export default Routes;
