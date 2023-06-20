import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
    name:'messages',
    initialState:{messages:[],showMessage:false,groupInfo:null,groups:[]},
    reducers:{
        loadMessages(state,action){
            state.messages=action.payload
        },
        setShowMessage(state,action){
            state.showMessage=action.payload
        },
        setGroupInfo(state,action){
            state.groupInfo=action.payload
        },
        setGroups(state,action){
            state.groups=action.payload
        }
    }
})

export default messageSlice;
export const messageAction=messageSlice.actions
export const messageReducer=messageSlice.reducer
