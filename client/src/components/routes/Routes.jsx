import React, { useContext } from "react";
import RegisterAndLoginForm from "../register/RegisterAndLoginForm";
import ChatScreen from "../chatscreen/ChatScreen";
import { UserContext } from "../usercontext/UserContext";

function Routes() {
  const { username, id } = useContext(UserContext);

  return (
    <div>
      {!username && <RegisterAndLoginForm />}
      {username && <ChatScreen />}
    </div>
  );
}

export default Routes;
