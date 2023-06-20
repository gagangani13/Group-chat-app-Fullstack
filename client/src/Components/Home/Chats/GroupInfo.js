import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageAction } from "../../Store/messageSlice";
import './Messages.css'
import './GroupInfo.css'
import './MessageList.css'
import axios from "axios";
const GroupInfo = () => {
  const dispatch = useDispatch();
  const name=localStorage.getItem('userName')
  const idToken=useSelector(state=>state.authenticate.idToken)
  const [options,setOptions]=useState(null);
  const [participants,setParticipants]=useState([]);
  const [addParticipants,setAddParticipants]=useState([])
  const [admin,setAdmin]=useState(false)
  const groupInfo=useSelector(state=>state.messageReducer.groupInfo)
  const groupId=groupInfo.groupId
  const groupName=groupInfo.groupName

  useEffect(()=>{
    getParticipants();
    // eslint-disable-next-line
  },[])

  function closeGroupInfo() {
    setOptions(null)
    dispatch(messageAction.setGroupInfo(null));
  }
  function showOptions(id,name,admin) {
    setOptions({id,name,admin})
  }
  async function getParticipants() {
    const response=await axios.get(`http://localhost:5000/getParticipants?groupId=${groupId}`,{headers:{'Authorization':idToken}})
    const data=await response.data
    try {
        if (!data.ok) {
            throw new Error()
        }
        let arr=[]
        const data2=data.participants
        for(let i in data2){
            arr.unshift({name:data2[i].name,userId:data2[i].UserId,admin:data2[i].admin})
        }
        let arr2=[]
        const data3=data.addParticipants
        for(let i in data3){
          arr2.unshift({name:data3[i].name,id:data3[i].id})
      }
        setParticipants(arr)
        setAddParticipants(arr2)
        setAdmin(data.admin)
    } catch (error) {
        alert(data.error)
    }
  }
  async function addToGroup(e) {
    const id=e.target.id
    const response=await axios.post(`http://localhost:5000/joinGroup?groupId=${groupId}`,{participantId:id},{headers:{'Authorization':idToken}})
    const data=await response.data
    try {
      if (!data.ok) {
        throw new Error()
      }
      getParticipants()
    } catch (error) {
      alert(data.error)
    }
  }
  async function makeAdmin(){
    const response=await axios.patch(`http://localhost:5000/makeAdmin?groupId=${groupId}`,{participantId:options.id},{headers:{'Authorization':idToken}})
    const data=await response.data
    try {
      if (!data.ok) {
        throw new Error()
      }
      getParticipants()
      setOptions(null)
    } catch (error) {
      alert(data.error)
    }
  }
  async function removeParticipant() {
    console.log(groupId,options);
    const response=await axios.delete(`http://localhost:5000/removeParticipant/${options.id}?groupId=${groupId}`,{headers:{'Authorization':idToken}})
    const data=await response.data
    try {
      if (!data.ok) {
        throw new Error()
      }
      getParticipants()
      setOptions(null)
    } catch (error) {
      alert(data.error)
    }
  }
  return (<>
    <div className="groupName">
      <button
        className="fa-solid fa-arrow-left-long backBtn"
        onClick={closeGroupInfo}
      ></button>
      <h3 className="chats">{groupName}</h3>
    </div>
    <div className="participants">
        <h5>Participants</h5>
        {participants.map((item)=>{
            return <li className="participantsRow">
            <span>{item.name!==name?item.name:'You'}</span>
            {item.admin&&<span className="admin">Admin<i class="fa-solid fa-circle-check"></i></span>}
            {admin&&<button className="fa-solid fa-ellipsis-vertical backBtn" onClick={()=>showOptions(item.userId,item.name,item.admin)} type="button"></button>}
        </li>
        })}
        {options!==null&&<div className="optionsTab">
            <h6>{options.name!==name?options.name:'You'}</h6>
            <div className="btnsAlign">
            <button type="button" onClick={makeAdmin}>{options.admin?`Remove as Admin`:'Make Admin'}</button>
            <button type="button" onClick={removeParticipant} >Remove from group</button>
            <button onClick={()=>{setOptions(null)}}>Close</button>
            </div>
        </div>}
    </div>
    {admin&&<div className="participants">
        <h5>Add Participants</h5>
        {addParticipants.map((item)=>{
          return <li className="participantsRow">
          <span>{item.name}</span>
          <button type="button" id={item.id} onClick={addToGroup}>Add to Group</button>
      </li>
        })}
        {addParticipants.length===0&&<li className="participantsRow">No new users to Add</li>}
    </div>}
    </>
  );
};

export default GroupInfo;
