import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageAction } from "../../Store/messageSlice";
import "./Messages.css";
import "./GroupInfo.css";
import "./MessageList.css";
import axios from "axios";
import { motion } from "framer-motion";

const optionTabVariant={
  initial:{y:'100%'},
  animate:{y:'0%',transition:{type:'tween',duration:0.3}}
}

const GroupInfo = () => {
  const dispatch = useDispatch();
  const name = localStorage.getItem("userName");
  const idToken = useSelector((state) => state.authenticate.idToken);
  const [options, setOptions] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [addParticipants, setAddParticipants] = useState([]);
  const [admin, setAdmin] = useState(false);
  const groupInfo = useSelector((state) => state.messageReducer.groupInfo);
  const groupId = groupInfo.groupId;
  const groupName = groupInfo.groupName;
  const newGroupNameRef = useRef("");

  useEffect(() => {
    getParticipants();
    // eslint-disable-next-line
  }, []);

  function closeGroupInfo() {
    dispatch(messageAction.setGroupInfo(null));
    setOptions(null);
  }
  function showOptions(id, name, admin) {
    setOptions({ id, name, admin });
  }
  async function getParticipants() {
    const response = await axios.get(
      `https://chat-app-server-k570.onrender.com/getParticipants?groupId=${groupId}`,
      { headers: { Authorization: idToken } }
    );
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error();
      }
      let arr = [];
      const data2 = data.participants;
      for (let i in data2) {
        arr.unshift({
          name: data2[i].name,
          userId: data2[i].UserId,
          admin: data2[i].admin,
        });
      }
      let arr2 = [];
      const data3 = data.addParticipants;
      for (let i in data3) {
        arr2.unshift({ name: data3[i].name, id: data3[i].id });
      }
      setParticipants(arr);
      setAddParticipants(arr2);
      setAdmin(data.admin);
    } catch (error) {
      alert(data.error);
    }
  }
  async function addToGroup(e) {
    const id = e.target.id;
    const response = await axios.post(
      `https://chat-app-server-k570.onrender.com/joinGroup?groupId=${groupId}`,
      { participantId: id },
      { headers: { Authorization: idToken } }
    );
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error();
      }
      getParticipants();
    } catch (error) {
      alert(data.error);
    }
  }
  async function makeAdmin() {
    const response = await axios.patch(
      `https://chat-app-server-k570.onrender.com/makeAdmin?groupId=${groupId}`,
      { participantId: options.id },
      { headers: { Authorization: idToken } }
    );
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error();
      }
      getParticipants();
      setOptions(null);
    } catch (error) {
      alert(data.error);
    }
  }
  async function removeParticipant() {
    const response = await axios.delete(
      `https://chat-app-server-k570.onrender.com/removeParticipant/${options.id}?groupId=${groupId}`,
      { headers: { Authorization: idToken } }
    );
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error();
      }
      getParticipants();
      setOptions(null);
    } catch (error) {
      alert(data.error);
    }
  }
  async function exitGroup() {
    const userResponse = prompt("Do you want to proceed? (Yes/No)");
    if (userResponse && userResponse.toLowerCase() === "yes") {
      const response = await axios.delete(
        `https://chat-app-server-k570.onrender.com/exitGroup/${groupId}`,
        { headers: { Authorization: idToken } }
      );
      const data = await response.data;
      try {
        if (!data.ok) {
          throw new Error();
        }
        closeGroupInfo();
      } catch (error) {
        alert(data.error);
      }
    } else {
      alert("Please type Yes if you want to exit");
    }
  }
  async function editGroupName() {
    if (!newGroupNameRef.current.value) {
      alert("Please input the group name to change it !!");
    } else {
      const response = await axios.patch(
        `https://chat-app-server-k570.onrender.com/editGroupName?groupId=${groupId}`,
        { groupName: newGroupNameRef.current.value,groupId },
        { headers: { Authorization: idToken } }
      );
      const data = await response.data;
      try {
        if (!data.ok) {
          throw new Error();
        }
        dispatch(
          messageAction.setGroupInfo({
            groupId,
            groupName: newGroupNameRef.current.value,
          })
        );
        setOptions(null)
      } catch (error) {
        alert("Failed to changed group name");
      }
    }
  }
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="groupName">
        <button
          className="fa-solid fa-arrow-left-long backBtn"
          onClick={closeGroupInfo}
        ></button>
        <h3 className="chats">{groupName}</h3>
      </div>
      {!options && (
        <div className="participants">
          <button type="button" id="exitGroup" onClick={exitGroup}>
            Exit Group
          </button>
          {admin&&<button type="button" id="editGroup" onClick={() => setOptions(true)}>
            Change Group Name
          </button>}
          <h5>Participants</h5>
          {participants.map((item) => {
            return (
              <li className="participantsRow">
                <span>{item.name !== name ? item.name : "You"}</span>
                {item.admin && (
                  <span className="admin">
                    Admin<i class="fa-solid fa-circle-check"></i>
                  </span>
                )}
                {admin && item.name !== name && (
                  <button
                    className="fa-solid fa-ellipsis-vertical backBtn"
                    onClick={() =>
                      showOptions(item.userId, item.name, item.admin)
                    }
                    type="button"
                  ></button>
                )}
              </li>
            );
          })}
        </div>
      )}
      {typeof options === "object" && options !== null && (
        <motion.div variants={optionTabVariant} animate='animate' initial='initial' className="optionsTab">
          <h6>{options.name !== name ? options.name : "You"}</h6>
          <div className="btnsAlign">
            <button type="button" onClick={makeAdmin}>
              {options.admin ? `Remove as Admin` : "Make Admin"}
            </button>
            <button type="button" onClick={removeParticipant}>
              Remove from group
            </button>
            <button
              onClick={() => {
                setOptions(null);
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
      {typeof options === "boolean" && options === true && (
        <motion.div variants={optionTabVariant} animate='animate' initial='initial' className="optionsTab">
          <h6>Edit Group Name</h6>
          <div className="btnsAlign">
            <input type="text" id="formInput" required ref={newGroupNameRef} />
            <button type="button" onClick={editGroupName}>
              Submit
            </button>
            <button
              onClick={() => {
                setOptions(null);
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
      {!options && admin && (
        <div className="participants">
          <h5>Add Participants</h5>
          {addParticipants.map((item) => {
            return (
              <li className="participantsRow">
                <span>{item.name}</span>
                <button type="button" id={item.id} onClick={addToGroup}>
                  Add
                </button>
              </li>
            );
          })}
          {addParticipants.length === 0 && (
            <li className="participantsRow">No new users to Add</li>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default GroupInfo;
