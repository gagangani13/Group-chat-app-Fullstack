import React from "react";
import LOGIN from "./Components/Login/LOGIN";
import { Switch,Route,Redirect, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Components/Store/store";
import ChangePassword from "./Components/Login/ChangePassword";
import Home from "./Components/Home/Home";
import { AnimatePresence } from "framer-motion";
const App = () => {
  const location=useLocation()
  return (
    <Provider store={store}>
      <AnimatePresence>
        <Switch location={location} key={location.key}>
          <Route path="/" exact>
            <LOGIN/>
          </Route>
          <Route path="/Home" exact>
            <Home/>
          </Route>
          <Route path='/Password/:Id' exact>
            <ChangePassword/>
          </Route>
          <Route path='*'>
            <Redirect to='/Home'/>
          </Route>
        </Switch>
      </AnimatePresence>
    </Provider>
  );
};

export default App;
