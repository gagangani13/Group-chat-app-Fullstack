import React from 'react'
import './MessageList.css'
import './Messages.css'
import Main from '../Main/Main'
const MessageList = () => {
  return (
    <Main>
      <h3 className='chats'>Chats</h3>  
      <div className='chatList'>
      <li className='chat'>
        <button className="fa-solid fa-user-plus backBtn"></button>
        <p>Group1</p>
        <button className="fa-solid fa-angle-right viewChatBtn"></button>
      </li>
      <li className='chat'>
        <button className="fa-solid fa-user-plus backBtn"></button>
        <p>Group1</p>
        <button className="fa-solid fa-angle-right viewChatBtn"></button>
      </li>
      <li className='chat'>
        <button className="fa-solid fa-user-plus backBtn"></button>
        <p>Group1</p>
        <button className="fa-solid fa-angle-right viewChatBtn"></button>
      </li>
      <li className='chat'>
        <button className="fa-solid fa-user-plus backBtn"></button>
        <p>Group1</p>
        <button className="fa-solid fa-angle-right viewChatBtn"></button>
      </li>
      <li className='chat'>
        <button className="fa-solid fa-user-plus backBtn"></button>
        <p>Group1</p>
        <button className="fa-solid fa-angle-right viewChatBtn"></button>
      </li>
      <li className='chat'>
        <button className="fa-solid fa-user-plus backBtn"></button>
        <p>Group1</p>
        <button className="fa-solid fa-angle-right viewChatBtn"></button>
      </li>
      <li className='chat'>
        <button className="fa-solid fa-user-plus backBtn"></button>
        <p>Group1</p>
        <button className="fa-solid fa-angle-right viewChatBtn"></button>
      </li>
      <li className='chat'>
        <button className="fa-solid fa-user-plus backBtn"></button>
        <p>Group1</p>
        <button className="fa-solid fa-angle-right viewChatBtn"></button>
      </li>
      </div>
    </Main>
  )
}

export default MessageList
