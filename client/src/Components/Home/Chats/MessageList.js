import React, { useEffect } from "react";
import "./MessageList.css";
import "./Messages.css";
import Main from "../Main/Main";
import { useDispatch, useSelector } from "react-redux";
import { messageAction } from "../../Store/messageSlice";
import GroupInfo from "./GroupInfo";
import axios from "axios";
import Messages from "./Messages";
const MessageList = () => {
  const groupInfo = useSelector((state) => state.messageReducer.groupInfo);
  const idToken = localStorage.getItem("idToken");
  const groups = useSelector((state) => state.messageReducer.groups);
  const showMessage = useSelector((state) => state.messageReducer.showMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    getGroups();
    // eslint-disable-next-line
  }, []);

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
        arr.push({ groupName: data2[i].groupName, groupId: data2[i].groupId });
      }
      dispatch(messageAction.setGroups(arr));
    } catch (error) {
      alert(data.error);
    }
  }
  return (
    <Main>
      {!groupInfo && (
        <>
          <h3 className="chats">Chats</h3>
          <div className="chatList">
            {groups.map((item) => {
              return (
                <li className="chat" id={item.groupId}>
                  <button
                    className="fa-solid fa-circle-info backBtn"
                    onClick={() => {
                      dispatch(
                        messageAction.setGroupInfo({
                          groupId: item.groupId,
                          groupName: item.groupName,
                        })
                      );
                    }}
                  ></button>
                  <p>{item.groupName}</p>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(messageAction.setShowMessage(true));
                      dispatch(
                        messageAction.setGroupInfo({
                          groupId: item.groupId,
                          groupName: item.groupName,
                        })
                      );
                    }}
                    className="fa-solid fa-angle-right viewChatBtn"
                  ></button>
                </li>
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
    </Main>
  );
};

export default MessageList;
