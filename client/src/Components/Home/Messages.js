import React, { useEffect, useRef, useState } from "react";
import "./Messages.css";
import { useDispatch, useSelector } from 'react-redux'
import { Form } from "react-bootstrap";
import axios from "axios";
import { messageAction } from "../Store/messageSlice";


const Messages = () => {
  const userName=useSelector(state=>state.authenticate.userName)
  const messages=useSelector(state=>state.messageReducer.messages)
  const messageRef = useRef();
  const dispatch=useDispatch()
  const idToken = localStorage.getItem("idToken");
  const localStorageMsgs=JSON.parse(localStorage.getItem('localStorageMsgs'))
  let handleBtns={latestOffset:localStorage.getItem('latestOffset'),nextOffset:localStorage.getItem('nextOffset'),localStorageMsgs: JSON.parse(localStorage.getItem('localStorageMsgs')),currOffset:localStorage.getItem('currOffset'),oldOffset:localStorage.getItem('oldOffset')}
  const [btns,setBtns]=useState(handleBtns)
  const [timer,updateTimer]=useState([]);
  useEffect(()=>{
    if (localStorageMsgs&&localStorageMsgs.length>0) {
        dispatch(messageAction.loadMessages(localStorageMsgs))
    }
    getMessages(handleBtns.latestOffset);
  
    return console.log('clean');
    // eslint-disable-next-line
  },[])
  async function sendMessage(e) {
    e.preventDefault();
    const details = { message: messageRef.current.value };
    const response = await axios.post(
      "http://localhost:5000/sendMessage",
      details,
      { headers: { Authorization: idToken } }
    );
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error();
      } else {
        messageRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
    getMessages()
  }

  
  async function getMessages(params=0) {
    const response = await axios.get(
      `http://localhost:5000/getMessages?offset=${params}`,
      { headers: { Authorization: idToken } }
    );
    const data = await response.data;
    try {
      if (data.ok === false) {
        throw new Error();
      } 
      let arr;
      if (messages && messages.length!==0) {
        arr=[...messages]
      } else {
        arr=[]
      }
      const data2 = data.messages;
      for(let i in data2){
        arr.push({name:data2[i].name,message:data2[i].messages})
        if (arr.length>10) {
          arr.shift()
        }
      }
      dispatch(messageAction.loadMessages(arr));
      localStorage.setItem('latestOffset',data.latestOffset)
      localStorage.setItem('nextOffset',data.nextOffset)
      localStorage.setItem('localStorageMsgs',JSON.stringify(arr))
      localStorage.setItem('currOffset',params)
      localStorage.setItem('oldOffset',data.oldOffset)
      setBtns({latestOffset:data.latestOffset,nextOffset:data.nextOffset,localStorageMsgs: JSON.stringify(arr),currOffset:params,oldOffset:data.oldOffset})

    } catch (error) {
      console.log(data.error);
    }
    if (data.currOffset===data.latestOffset) {
      updateTimer([setTimeout(() => {
        getMessages(data.latestOffset);
      }, 2000)]);
    }else{
      for(let i in timer){ // Tried to remove this but again problem started. Even if the timer useState is updated to empty [], the timers must be cleared
        clearTimeout(timer[i])
      }
      updateTimer([])
    }
    //very important I almost tried 6 hours.. when ever timer is called inside a function it will create new timer Id for each function call. So when you clear timer only one timer gets cleared not all. So you need to clear in such a way that entire timers must stop. So here I'm updating the timer useState only on latest chats, when the chats are older the timer is cleared so that it won't make problem.
  }
  return (
    <>
    {btns.nextOffset!==btns.latestOffset&&<button id='latestMessage' className="fa-solid fa-angles-down" onClick={()=>getMessages(btns.latestOffset)}></button>}
    <div className="messages">
      {btns.currOffset!==0&&<button id="oldMessage" onClick={()=>getMessages(btns.oldOffset)}>View old messages</button>}
      {messages.map((person) => {
        return (<>
          {person.message!=='Joined'&&<div className={person.name === userName ? "myMsg" : "personMsg"}>
            <p className="personName">
              {person.name === userName ? "You" : person.name}
            </p>
            <p className="personText">{person.message}</p>
          </div>}
          {person.message==='Joined'&&<p className='joinMsg'>
            {person.name === userName ? "You" : person.name} joined this group
            </p>}
        </>
        );
      })}
      {btns.nextOffset!==btns.currOffset&&<button id="oldMessage" onClick={()=>getMessages(btns.nextOffset)} type="button">View new messages</button>}
    </div>
    <Form id="sendMessage" onSubmit={sendMessage}>
    <Form.Control
      type="text"
      placeholder="Type your message here ..."
      ref={messageRef}
      required
    />
    <button
      className="fa-solid fa-paper-plane sendBtn"
      type="submit"
    ></button>
  </Form>
  </>
  );
};

export default Messages;
