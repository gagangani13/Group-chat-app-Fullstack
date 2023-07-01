import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { authAction } from "../../Store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./Header.css";
const Header = () => {
  const navLinkVariant = {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.1,
      fontWeight: "bold",
      transition: { duration: 0.25, type: "tween" },
    },
  };
  const dispatch = useDispatch();
  const [active, setActive] = useState("nav__menu");
  const [icon, setIcon] = useState("nav__toggler");
  const login=useSelector(state=>state.authenticate.login)
  const navToggle = () => {
    if (active === "nav__menu") {
      setActive("nav__menu nav__active");
    } else setActive("nav__menu");

    // Icon Toggler
    if (icon === "nav__toggler") {
      setIcon("nav__toggler toggle");
    } else setIcon("nav__toggler");
  };

  function logoutHandler() {
    dispatch(authAction.logoutHandler());
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("idToken");
  }

  return (
    <>
    {login&&<><div className="chatBg"/> 
    <header>
      <h1>Chat App</h1>
      <AnimatePresence>
        <motion.div
          className={active}
         >
          <motion.span
            variants={navLinkVariant}
            initial="initial"
            whileHover="whileHover"
          >
            <NavLink
              to="/Chats"
              activeClassName="activeLink"
              className="NavLink"
              onClick={navToggle}
            >
              CHATS
            </NavLink>
          </motion.span>
          <motion.span
            variants={navLinkVariant}
            initial="initial"
            whileHover="whileHover"
          >
            <NavLink
              to="/NewGroup"
              activeClassName="activeLink"
              className="NavLink"
              onClick={navToggle}
            >
              NEW GROUP
            </NavLink>
          </motion.span>
          <motion.span
            variants={navLinkVariant}
            initial="initial"
            whileHover="whileHover"
          >
            <NavLink to="/" className="NavLink" onClick={logoutHandler}>
              LOGOUT
            </NavLink>
          </motion.span>
        </motion.div>
      </AnimatePresence>
      <div onClick={navToggle} className={icon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </header></>}
    </>
  );
};

export default Header;
