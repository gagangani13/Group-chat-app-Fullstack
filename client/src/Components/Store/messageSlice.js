import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
    name:'messages',
    initialState:{messages:[],showMessage:false},
    reducers:{
        loadMessages(state,action){
            state.messages=action.payload
        },
        setShowMessage(state,action){
            state.showMessage=action.payload
        }
    }
})

export default messageSlice;
export const messageAction=messageSlice.actions
export const messageReducer=messageSlice.reducer
