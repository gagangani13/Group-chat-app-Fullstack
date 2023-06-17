import React from 'react'
import { Navbar } from 'react-bootstrap'
import { motion } from "framer-motion";
import { authAction } from '../../Store/authSlice';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './Header.css'
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
    function logoutHandler() {
    dispatch(authAction.logoutHandler());
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("idToken");
    }  
  return (
    <header>
              <h1>Chat App</h1>
              <Navbar style={{width: '70vw',
    justifyContent: 'space-around'}}>
                <motion.span
                  variants={navLinkVariant}
                  initial="initial"
                  whileHover="whileHover"
                >
                  <NavLink to='/Chats' activeClassName="activeLink" className='NavLink'>Chats</NavLink>
                </motion.span>
                <motion.span
                  variants={navLinkVariant}
                  initial="initial"
                  whileHover="whileHover"
                >
                  <NavLink to='/NewGroup' activeClassName="active-link" className='NavLink'>New Group</NavLink>
                </motion.span>
                <motion.span
                  variants={navLinkVariant}
                  initial="initial"
                  whileHover="whileHover"
                >
                  <span onClick={logoutHandler}>LOGOUT</span>
                </motion.span>
              </Navbar>
            </header>
  )
}

export default Header
