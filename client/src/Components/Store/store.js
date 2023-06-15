import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { messageReducer } from "./messageSlice";

const store=configureStore({
    reducer:{authenticate:authReducer,messageReducer:messageReducer}
})
export default store;