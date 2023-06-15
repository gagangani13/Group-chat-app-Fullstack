import React from "react";
import "./Messages.css";
import { useSelector } from 'react-redux'


const Messages = () => {
  const userName=useSelector(state=>state.authenticate.userName)
  const messages=useSelector(state=>state.messageReducer.messages)
  
  return (
    <div className="messages">
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
    </div>
  );
};

export default Messages;
