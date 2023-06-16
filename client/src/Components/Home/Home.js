import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { authAction } from "../Store/authSlice";
import { Navbar, NavLink } from "react-bootstrap";
import Messages from "./Messages";
import { Redirect } from "react-router-dom";
import { motion } from "framer-motion";
const Home = () => {
  const navLinkVariant = {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.1,
      fontWeight: "bold",
      transition: { duration: 0.25, type: "tween" },
    },
  };
  const loggedIn = useSelector((state) => state.authenticate.login);
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

  function logoutHandler() {
    dispatch(authAction.logoutHandler());
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("idToken");
  }

  // async function sendMessage(e) {
  //   e.preventDefault();
  //   const details = { message: messageRef.current.value };
  //   const response = await axios.post(
  //     "http://localhost:5000/sendMessage",
  //     details,
  //     { headers: { Authorization: idToken } }
  //   );
  //   const data = await response.data;
  //   try {
  //     if (!data.ok) {
  //       throw new Error();
  //     } else {
  //       messageRef.current.value = "";
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function getMessages(params) {
  //   const response = await axios.get(
  //     `http://localhost:5000/getMessages?offset=${params}`,
  //     { headers: { Authorization: idToken } }
  //   );
  //   const data = await response.data;
  //   try {
  //     if (data.ok === false) {
  //       throw new Error();
  //     } 
  //     let arr = messages||[];
  //     const data2 = data.messages;
  //     for(let i in data2){
  //       arr.push({name:data2[i].name,message:data2[i].messages})
  //     }
  //     dispatch(messageAction.loadMessages(arr));
  //     localStorage.setItem("localStorageMsgs", JSON.stringify(arr));
  //     localStorage.setItem('latestOffset',data.latestOffset)
  //     localStorage.setItem('nextOffset',data.nextOffset)
  //     localStorage.setItem('oldtOffset',data.oldOffset)
  //     localStorage.setItem('currOffset',params)
      
  //   } catch (error) {
  //     console.log(data.error);
  //   }
  //   if (params>=latestOffset) {
  //     setTimeout(() => {
  //       getMessages();
  //     }, 2000);
  //   }
  // }
  return (
    <>
      {!loggedIn && <Redirect to="/" />}
      {loggedIn && (
        <motion.div
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ type: "tween", duration: 1 }}
        >
          <div className="chatBg"></div>
          <>
            <header>
              <h1>Chat App</h1>
              <Navbar>
                <motion.span
                  variants={navLinkVariant}
                  initial="initial"
                  whileHover="whileHover"
                >
                  <NavLink onClick={logoutHandler}>LOGOUT</NavLink>
                </motion.span>
              </Navbar>
            </header>
            <main>
              <Messages />
            </main>
          </>
        </motion.div>
      )}
    </>
  );
};

export default Home;
