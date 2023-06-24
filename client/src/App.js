import React from "react";
import LOGIN from "./Components/Login/LOGIN";
import { Switch,Route,Redirect, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Components/Store/store";
import ChangePassword from "./Components/Login/ChangePassword";
import { AnimatePresence } from "framer-motion";
import Header from "./Components/Home/Header/Header";
import Chats from "./Components/Home/Chats/Chats";
import './App.css'
import NewGroup from "./Components/Home/NewGroup/NewGroup";




const App = () => {
  const location=useLocation()
  return (
    <Provider store={store}>
      <div className="chatBg"/>      
      <Header/>
      <AnimatePresence>
        <Switch location={location} key={location.key}>
          <Route path="/" exact>
            <LOGIN/>
          </Route>
          <Route path="/Chats" exact>
            <Chats/>
          </Route>
          <Route path="/NewGroup" exact>
            <NewGroup/>
          </Route>
          <Route path='*'>
            <Redirect to='/Chats'/>
          </Route>
          <Route path='/Password/:Id' exact>
            <ChangePassword/>
          </Route>
        </Switch>
      </AnimatePresence>
    </Provider>
  );
};

export default App;
