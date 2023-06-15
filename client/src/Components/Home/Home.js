import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { authAction } from "../Store/authSlice";
import { Form, Navbar,NavLink } from "react-bootstrap";
import Messages from "./Messages";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { messageAction } from "../Store/messageSlice";
import { motion } from "framer-motion";
const Home = () => {
    const navLinkVariant={
        initial:{scale:1},
        whileHover:{scale:1.1,fontWeight:'bold',transition:{duration:.25,type:'tween'}}
    }
  const loggedIn = useSelector((state) => state.authenticate.login);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const idToken = localStorage.getItem("idToken");
  const userName = localStorage.getItem("userName");
  const messageRef = useRef();

  useEffect(() => {
    idToken && dispatch(authAction.loginHandler());
    userId && dispatch(authAction.setUserId(userId));
    userName && dispatch(authAction.setUserName(userName));
    idToken && dispatch(authAction.setToken(idToken));
    getMessages()
    // eslint-disable-next-line
  }, []);

  function logoutHandler() {
    dispatch(authAction.logoutHandler());
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("idToken");
  }

  async function sendMessage(e) {
    e.preventDefault()
    const details={message:messageRef.current.value}
    const response=await axios.post('http://localhost:5000/sendMessage',details,{headers:{'Authorization':idToken}})
    const data=await response.data
    try {
        if(!data.ok){
            throw new Error()
        }else{
            messageRef.current.value=''
        }
    } catch (error) {
        console.log(error);
    }
  }

  async function getMessages() {
    const response=await axios.get('http://localhost:5000/getMessages',{headers:{'Authorization':idToken}})
    const data= await response.data
    try {
        if(!data.ok){
            throw new Error()
        }else{
            let arr=[]
            const data2=data.messages
            for(let i in data2){
                arr.push({name:data2[i].name,message:data2[i].messages})
            }
            dispatch(messageAction.loadMessages(arr))
        }
    } catch (error) {
        alert(data.error)
    }
    setTimeout(()=>{
        getMessages()
    },2000)
  }
  return (
    <>
      {!loggedIn && <Redirect to="/" />}
      {loggedIn && (
        <motion.div  initial={{y:'-100vh'}} animate={{y:0}} transition={{type:'tween',duration:1}}>
          <div className="chatBg"></div>
          <>
            <header>
              <h1>Chat App</h1>
              <Navbar>
                <motion.span variants={navLinkVariant} initial='initial' whileHover='whileHover'><NavLink onClick={logoutHandler}>LOGOUT</NavLink></motion.span>
              </Navbar>
            </header>
            <main>
              <Messages />
              <Form id="sendMessage" onSubmit={sendMessage}>
                <Form.Control
                  type="text"
                  placeholder="Type your message here ..."
                  ref={messageRef}
                  required
                />
                <button
                  className="fa-solid fa-paper-plane sendBtn"
                  type="submit"
                ></button>
              </Form>
            </main>
          </>
        </motion.div>
      )}
    </>
  );
};

export default Home;
