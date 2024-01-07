import React from 'react';
import userImage from '../images/user.png';
import statusImage from '../images/status.png'
import chatImage from '../images/chat.png'
import dotsImage from '../images/dots.png'
import { useEffect } from 'react';
import UserModal from './userModal';
import { UserContext } from './chatPage';

import { useState, useContext } from "react";
import axios from 'axios';
import { socket } from '../App';

const LeftPart = (props) => {
    let [currentUser, currentRoom, setCurrentRoom, setCurrentUser] = useContext(UserContext);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        console.log('here');
        if (currentUser.rooms) {
            axios.post('http://localhost:3000/users/getRooms', currentUser.rooms, { withCredentials: true })
                .then((response) => {
                    console.log(response.data);
                    setRooms(response.data);
                })
                .catch(error => { console.log(error) });
        }

        socket.emit('joinAllFriends', currentUser._id);


        return () => {
            socket.off('react-notify');
        }

    }, []);

    //issue with current room
    useEffect(() => {
        let newState = rooms.map((room, idx) => {
            if (room._id === currentRoom._id) {
                room.notify = false;
            }
            return room;
        })
        setRooms(newState);
    }, [currentRoom]);

    socket.on('react-notify', (room) => {
        room.notify = true;

        if(currentRoom._id === room._id){
            return;
        }

        let newRooms = rooms.filter((prevRoom) => {
            console.log(prevRoom._id !== room._id);
            if (prevRoom._id !== room._id) {
                console.log(prevRoom);
                return prevRoom;
            }
        });

        console.log(newRooms);

        newRooms.unshift(room);

        console.log(newRooms);

        setRooms(newRooms);


    });

    function handleRoomClick(room) {
        console.log(room);
        setCurrentRoom(room);
    }

    function updateProfile(event) {
        console.log('changed!');
        const files = event.target.files;
        const formData = new FormData();
        formData.append("file", files[0]);
        fetch("http://localhost:3000/uploadProfilePic", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            console.timeLog(data.data);
            setCurrentUser({...currentUser,profileUrl:data.data});
            socket.emit('updateProfile', { activeUserId:currentUser._id, url: data.data });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    return (
        <div id="mainLeft" className="leftPart">
            <div className="upperLeftPart">
                <div className="upperBar">
                    <form className="profileForm" method="post" encType="multipart/form-data" action="http://localhost:3000/uploadProfilePic">
                        <input id="selectImage"  onChange={updateProfile} type="file" name="file" accept="image/*" required></input>
                    </form>
                    <label htmlFor="selectImage">
                        <img id="activeUserImage" className="userImage" src={currentUser.profileUrl} alt="UserImage" title="Change Profile"></img>
                    </label>
                    <p id="activeName" style={{ fontWeight: 'bold', color: '#009698' }}>{currentUser.username}</p>
                    <div className="rightMainActions">
                        <img id="logout" className="icons" src={statusImage} alt=""></img>
                        <img id="newChat" className="icons" src={chatImage} alt="" style={{ marginLeft: 25 + 'px', marginRight: 25 + 'px' }}></img>
                        <img id="moreOptions" className="icons" src={dotsImage} alt=""></img>
                    </div>
                </div>
                <div className="searchBarCont">
                    <input type="text" placeholder="search a chat..."></input>
                </div>
                <p id="indicator" style={{ textAlign: 'center', color: '#009698' }}>Chats</p>
            </div>
            <div id="leftList" className="friendList">
                {rooms && rooms.map((room, index) => {
                    return <UserModal room={room} key={index} openChat={handleRoomClick} />
                })}
            </div>
        </div>
    );
}

export default LeftPart;
