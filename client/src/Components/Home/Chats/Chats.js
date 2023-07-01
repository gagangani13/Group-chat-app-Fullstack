import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Chats.css";
import { authAction } from "../../Store/authSlice";
import Messages from "./Messages";
import { Redirect } from "react-router-dom";
import {  motion } from "framer-motion";
import MessageList from "../Chats/MessageList";
const Chats = () => {
  const loggedIn = useSelector(state=> state.authenticate.login);
  const showMessage=useSelector(state=>state.messageReducer.showMessage);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const idToken = localStorage.getItem("idToken");
  const userName = localStorage.getItem("userName");
  
  useEffect(() => {
    idToken && dispatch(authAction.loginHandler());
    userId && dispatch(authAction.setUserId(userId));
    userName && dispatch(authAction.setUserName(userName));
    idToken && dispatch(authAction.setToken(idToken));
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {loggedIn && (
        <motion.div
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ type: "tween", duration: .5 }}
        >
          <>
              {!showMessage&&<MessageList/>}
              {showMessage&&<Messages />}
          </>
        </motion.div>
      )}
      {!loggedIn && <Redirect to="/" />}
    </>
  );
};

export default Chats;
