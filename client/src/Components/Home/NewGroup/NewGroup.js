import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./NewGroup.css";
import { motion } from "framer-motion";
const NewGroup = () => {
  const groupRef = useRef();
  const [chats, setChats] = useState(false);
  const idToken = useSelector((state) => state.authenticate.idToken);
  async function createGroup(e) {
    e.preventDefault();
    if (!groupRef.current.value) {
      return alert("Invalid input");
    }
    const response = await axios.post(
      "http://localhost:5000/createGroup",
      { groupName: groupRef.current.value },
      { headers: { Authorization: idToken } }
    );
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error();
      }
      setChats(true);
      alert("Created new group successfully");
    } catch (error) {
      alert(data.error);
    }
  }
  return (
    <motion.div
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ type: "tween", duration: .5 }}
        >
      <Form onSubmit={createGroup} id="createGroup">
        <Form.Control
          type="text"
          placeholder="Enter your group name here ..."
          ref={groupRef}
          id="groupName"
          required
        />
        <button type="submit">Create</button>
      </Form>
      {chats && <Redirect to="/chats" />}
    </motion.div>
  );
};

export default NewGroup;
