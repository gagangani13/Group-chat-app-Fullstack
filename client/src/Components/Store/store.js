import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";

const store=configureStore({
    reducer:{authenticate:authReducer}
})
export default store;