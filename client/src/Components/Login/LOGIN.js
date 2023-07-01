import { useRef, useState } from "react";
import { Form, NavLink, Button, FloatingLabel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { authAction } from "../Store/authSlice";
import axios from "axios";
import "./login.css";
import { motion } from "framer-motion";

const LOGIN = () => {
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.authenticate.login);
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const nameRef = useRef();
  const mobileRef = useRef();
  const [login, setLogin] = useState(true);
  const [newPassword, setNewPassword] = useState(false);

  function setLoginHandler() {
    if (login) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  }
  function setPasswordHandler() {
    if (newPassword) {
      setNewPassword(false);
    } else {
      setNewPassword(true);
    }
  }
  async function addData(e) {
    e.preventDefault();
    if (!login) {
      if (passwordRef.current.value === confirmRef.current.value) {
        const response = await axios.post("http://localhost:5000/newUser", {
          email: emailRef.current.value,
          password: passwordRef.current.value,
          name: nameRef.current.value,
          mobile: mobileRef.current.value,
        });
        const data = await response.data;
        try {
          if (response) {
            nameRef.current.value = "";
            emailRef.current.value = "";
            passwordRef.current.value = "";
            confirmRef.current.value = "";
            mobileRef.current.value = "";
            alert(data.message);
            setLogin(true);
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.log(error.message);
        }
      } else {
        alert("Password not matching");
      }
    } else if (login && newPassword) {
      const response = await axios.post(
        "http://localhost:5000/forgotPassword",
        { email: emailRef.current.value }
      );
      const data = await response.data;
      try {
        if (data.ok) {
          setNewPassword(false);
          emailRef.current.value = "";
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log(error);
      }
      alert(data.message);
    } else {
      const response = await axios.post("http://localhost:5000/loginUser", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      const data = await response.data;
      try {
        if (data.ok) {
          emailRef.current.value = "";
          passwordRef.current.value = "";
          const token = localStorage.setItem("idToken", data.idToken);
          const userId = localStorage.setItem("userId", data.emailId);
          const userName = localStorage.setItem("userName", data.name);
          dispatch(authAction.loginHandler());
          dispatch(authAction.setToken(token));
          dispatch(authAction.setUserId(userId));
          dispatch(authAction.setUserName(userName));
        } else {
          throw new Error();
        }
      } catch (error) {
        alert(data.message);
      }
    }
  }
  return (
    <>
      {!loginState && (
        <motion.div
          animate={{ y: 0 }}
          initial={{ y: "100vh" }}
          transition={{ type: "tween", duration: 1 }}
          id="loginPage"
        >
          <div id="startpage"></div>
          <div>
            <div className="title">
              <lottie-player
                src="https://assets6.lottiefiles.com/private_files/lf30_tvxeldei.json"
                class="msgBox"
                background="#EDF43E"
                speed="1"
                loop
                autoplay
              ></lottie-player>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3,
                  type: "spring",
                }}
                id="loginH1"
              >
                Chat App
              </motion.h1>
            </div>
            <motion.div
              initial={{ y: "100vh" }}
              animate={{ y: 0 }}
              transition={{ stiffness: 100, type: "tween", duration: 1 }}
              className="layout"
            >
              <h2 className="h2Title">
                {!newPassword && (login ? "LOGIN" : "SIGN UP")}
                {newPassword && "CHANGE PASSWORD"}
              </h2>
              <div id="container">
                {newPassword && <p>Enter the registered Email</p>}

                <Form className="d-grid" onSubmit={addData}>
                  {!login && (
                    <>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Name"
                        className="mb-3 text-dark"
                      >
                        <Form.Control
                          type="text"
                          ref={nameRef}
                          placeholder="Name"
                          required
                        />
                      </FloatingLabel>

                      <FloatingLabel
                        controlId="floatingInput"
                        label="Mobile"
                        className="mb-3 text-dark"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Mobile"
                          ref={mobileRef}
                          required
                        />
                      </FloatingLabel>
                    </>
                  )}
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email"
                    className="mb-3 text-dark"
                  >
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      ref={emailRef}
                      required
                    />
                  </FloatingLabel>
                  {!newPassword && (
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Password"
                      className="mb-3 text-dark"
                    >
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        ref={passwordRef}
                        required
                      />
                    </FloatingLabel>
                  )}
                  {!login && (
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Confirm Password"
                      className="mb-3 text-dark"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Enter password"
                        ref={confirmRef}
                        required
                      />
                    </FloatingLabel>
                  )}
                  {!newPassword && login && (
                    <NavLink
                      className="d-flex justify-content-center mb-3"
                      id="NavLink"
                      onClick={setPasswordHandler}
                    >
                      Forgot Password ?
                    </NavLink>
                  )}
                  {!newPassword && (
                    <Button className="mb-3" id="btnStyle" type="submit">
                      {login ? "LOGIN" : "SIGN UP"}
                    </Button>
                  )}
                  {newPassword && (
                    <Button className="mb-3" id="btnStyle" type="submit">
                      SEND LINK
                    </Button>
                  )}
                  <div className="d-flex justify-content-center">
                    {!newPassword && login ? (
                      <p>Don't have an account? </p>
                    ) : (
                      <p>Already have an account? </p>
                    )}
                    {!newPassword && (
                      <NavLink id="NavLink" onClick={setLoginHandler}>
                        {!login ? "LOGIN" : "SIGN UP"}
                      </NavLink>
                    )}
                    {newPassword && (
                      <NavLink id="NavLink" onClick={setPasswordHandler}>
                        LOGIN
                      </NavLink>
                    )}
                  </div>
                </Form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      {loginState && (
        <Route>
          <Redirect to="/Chats" />
        </Route>
      )}
    </>
  );
};

export default LOGIN;
