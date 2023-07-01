import React, { useEffect } from "react";
import "./MessageList.css";
import "./Messages.css";
import { useDispatch, useSelector } from "react-redux";
import { messageAction } from "../../Store/messageSlice";
import GroupInfo from "./GroupInfo";
import axios from "axios";
import Messages from "./Messages";
import io from "socket.io-client";
import { motion } from "framer-motion";
const MessageList = () => {
  const socket = io.connect("http://localhost:5000");

  const groupInfo = useSelector((state) => state.messageReducer.groupInfo);
  const idToken = localStorage.getItem("idToken");
  const groups = useSelector((state) => state.messageReducer.groups);
  const showMessage = useSelector((state) => state.messageReducer.showMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    getGroups();
    // eslint-disable-next-line
  }, [groupInfo]);

  async function getGroups() {
    const response = await axios.get("http://localhost:5000/groups", {
      headers: { Authorization: idToken },
    });
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error();
      }
      let arr = [];
      const data2 = data.groups;
      for (let i in data2) {
        arr.push({ groupName: data2[i].groupName, groupId: data2[i].id });
      }
      dispatch(messageAction.setGroups(arr));
    } catch (error) {
      alert(data.error);
    }
  }

  function viewChat(item) {
    dispatch(messageAction.setShowMessage(true));
    dispatch(
      messageAction.setGroupInfo({
        groupId: item.groupId,
        groupName: item.groupName,
      })
    );
    socket.emit("joinChat", item.groupId);
  }

  function viewInfo(item) {
    dispatch(
      messageAction.setGroupInfo({
        groupId: item.groupId,
        groupName: item.groupName,
      })
    );
  }

  return (
    <div className="groupsBg">
      {!groupInfo && (
        <>
          <h3 className="chatsHome">Chats</h3>
          <div className="chatList">
            {groups.map((item) => {
              return (
                <motion.li initial={{scale:1}} whileHover={{scale:.9,x:0}} transition={{type:"tween",stiffness:100}} className="chat" id={item.groupId}>
                  <button
                    className="fa-solid fa-circle-info backBtn"
                    onClick={() => {
                      viewInfo(item)
                    }}
                  ></button>
                  <p
                    onClick={() => {
                      viewChat(item);
                    }}
                  >
                    {item.groupName}
                  </p>
                  <i className="fa-solid fa-angle-right viewChatIcon" onClick={() => {
                      viewChat(item);
                    }}></i>
                </motion.li>
              );
            })}
            {groups.length === 0 && (
              <p className="noGroups">
                No groups to show.. Create one and start chating
              </p>
            )}
          </div>
        </>
      )}
      {groupInfo && <GroupInfo />}
      {showMessage && <Messages />}
    </div>
  );
};

export default MessageList;
