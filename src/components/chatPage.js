import React from  'react';
import '../cssFiles/chatPage.css'
import LeftPart from './leftPart';
import RightPart from './rightPart';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useJwt } from 'react-jwt';
import { useState, useEffect, createContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export {UserContext};

const ChatPage = () => {

    const { decodedToken, isExpired } = useJwt(Cookies.get('jwt'));
    
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentRoom, setCurrentRoom] = useState(undefined);
    const [leftRooms, setLeftRooms] = useState(undefined);

    const setRooms = (roomList)=>{
        setLeftRooms(roomList);
    }

    useEffect(() => { 
        // console.log('chat ',currentUser);
        if(decodedToken){
            axios.post('http://localhost:3000/users/getUserDetails',{id:decodedToken._id})
            .then(response=>{
                setCurrentUser(response.data);
            })
            .catch((error)=>{
                console.log(error);
            });
        }
    }, [decodedToken]);

    return (
        <UserContext.Provider value={[currentUser,currentRoom,setCurrentRoom,setCurrentUser]}>
            <div className ="mainContainerChat">
                {currentUser?<LeftPart rooms = {leftRooms} setChatRooms = {setRooms} />:''}
                {currentRoom?<RightPart activeRoom = {currentRoom} />:null}
            </div>
        </UserContext.Provider>
    );
}

export default ChatPage;
