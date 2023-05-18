import React, { useEffect, useRef, useState } from "react";
import Avatar from "../avatar/Avatar";
import Logo from "../logo/Logo";
import { useContext } from "react";
import { UserContext } from "../usercontext/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";

function ChatScreen() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMsg, setNewMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();
  const { username, id } = useContext(UserContext);

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket(`ws://localhost:3001`);
    setWs(ws);
    ws.addEventListener(`message`, handleMessage);

    //this will help in auto reconnecting all the client to the websocket
    ws.addEventListener(`close`, () => {
      setTimeout(() => {
        console.log(`Disconnected. Trying to reconnect.`);
        connectToWs();
      }, 1000);
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(ev) {
    ev.preventDefault();
    console.log(`sending`);
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMsg,
      })
    );
    setNewMsg(``);
    setMessages((prev) => [
      ...prev,
      {
        text: newMsg,
        isOur: true,
        sender: id,
        recipient: selectedUserId,
        id: Date.now(),
      },
    ]);
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behaviour: `smooth`, block: `end` });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("api/auth/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const excludeLoggedInUser = { ...onlinePeople };
  delete excludeLoggedInUser[id]; //this will delete the current loggedin user from online user list

  const msgWithoutDupes = uniqBy(messages, `_id`);

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 p-4">
        <Logo />
        {Object.keys(excludeLoggedInUser).map((userId) => (
          <div
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={
              "border-b border-grey-100 flex items-center gap-2 cursor-pointer " +
              (userId === selectedUserId ? `bg-blue-50` : ``)
            }
          >
            {userId === selectedUserId && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex gap-2 pl-4 py-2 items-center">
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className="text-grey-800">{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center ">
              <div className="text-gray-400">
                &larr; Select a person from the online user list
              </div>
            </div>
          )}
          {selectedUserId && (
            <div className="relative h-full ">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2 ">
                {msgWithoutDupes.map((message) => (
                  <div
                    className={
                      message.sender === id ? `text-right` : `text-left`
                    }
                  >
                    <div
                      className={
                        "text-left inline-block p-2 my-2 rounded-md text-sm " +
                        (message.sender === id
                          ? `bg-blue-500 text-white`
                          : `bg-white text-gray-500`)
                      }
                    >
                      sender:{message.sender} <br />
                      my id :{id} <br />
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>
        {selectedUserId && (
          <form onSubmit={sendMessage} className="flex gap-2 ">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type you messages here"
              className="bg-white border rounded-sm p-2 flex-grow "
            />
            <button
              typeof="submit"
              className="bg-blue-500 p-2 rounded-sm text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChatScreen;
