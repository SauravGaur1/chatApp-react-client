import React, { useRef } from 'react';
import userImage from '../images/user.png'
import searchImage from '../images/search.png'
import dotsImage from '../images/more.png'
import happyImage from '../images/happy.png'
import linkImage from '../images/link.png'
import micImage from '../images/microphone.png'

import { useState, useContext, useEffect } from "react";

import { UserContext } from './chatPage';
import axios from 'axios';
import MessageModal from './messageModal';
import { socket } from '../App';
let emoji_api_url = 'https://emoji-api.com/emojis?access_key=93b19c83bb3c0b059b1ef1c84c41397b49aff942';

const RightPart = (props) => {
    let [currentUser, currentRoom] = useContext(UserContext);

    const [chatMessages, setChatMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [openedRoom, setOpenedRoom] = useState(currentRoom);
    const [openemojiDialog, setOpenEmojiDialog] = useState(false);
    const [emojis, setEmojis] = useState(JSON.parse(localStorage.getItem('emojis')));

    const chatSection = useRef();

    useEffect(() => {

        socket.emit('joinRoom', currentRoom._id);

        socket.on('message', (message) => {
            console.log(message);
            console.log(openedRoom._id, '<= current room ,message room Id =>', message.roomid);
            if (openedRoom._id === message.roomid) {
                setChatMessages([...chatMessages, message])
            } else {
                // socket.emit('react-notify',message);
            }
        })

        socket.on('mediaMessage', (message) => {
            setChatMessages([...chatMessages,message]);
        });

        chatSection.current.scrollTo({
            top: chatSection.current.scrollHeight,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour 
               in place of 'smooth' */
        });

        return () => {
            socket.off('message');
        };
    }, [chatMessages]);

    useEffect(() => {

        axios.post('http://localhost:3000/users/chat', { roomId: currentRoom._id }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
            .then((response) => {
                console.log(response.data);
                setChatMessages(response.data);
            });

        setOpenedRoom(currentRoom);

    }, [currentRoom]);


    function formatMessage(sentby, text, roomid, sendername) {
        let currentDate = new Date();
        let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        let formatedData = {
            sentby,
            text,
            roomid,
            time,
            sendername
        }
        return formatedData;
    }

    function typingMessage(event) {
        console.log('hii');
        if (event.key === 'Enter' && messageText != '') {
            console.log('in');
            const message = formatMessage(currentUser._id, messageText, currentRoom._id, currentUser.username);
            socket.emit('message', message);
            setChatMessages([...chatMessages, message])
            setMessageText('');
        }
    }

    function emojiApi() {

        setOpenEmojiDialog((prevState) => {
            return !prevState;
        })

        if (localStorage.getItem('emojis')) {
            return;
        }



        axios.get(emoji_api_url)
            .then((response) => {
                console.log(response.data);
                localStorage.setItem('emojis', JSON.stringify(response.data));
                setEmojis(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function appendEmoji(event) {
        let emoji = event.target.innerText;
        setMessageText(messageText + emoji);
    }

    function sendImageInChat(event) {
        const files = event.target.files;
        const formData = new FormData();
        formData.append("file", files[0]);
        console.log('chatImage');
        // formData.append("message", message);
        fetch("http://localhost:3000/addChatImage", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                let message = formatMessage(currentUser._id, '', currentRoom._id, currentUser.username);
                message.imageUrl = data.data;

                socket.emit('addImageToRoom', message);

                // let toEmitFriend = currentRoom;
                // let msgData = {
                //     message,
                //     toEmitFriend
                // }
                // socket.emit('joinWithFriend', msgData);
                socket.emit('message', message);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div id="mainRight" className="rightPart">
            <div className="topRightBar">
                <div className="leftPart">
                    <img id='activeRoomIcon' className="userImage" src={currentRoom && currentRoom.profileUrl ? currentRoom.profileUrl : userImage} alt=""></img>
                    <div className="userRightCont" style={{ marginLeft: 10 + 'px' }}>
                        <p id="chatUserName">{currentRoom && currentRoom.roomname}</p>
                        <p id="userIndicator" className="fadeText">Last seen</p>
                    </div>
                </div>
                <div className="rightPart">
                    <img className="icons" src={searchImage} alt="" style={{ margin: 10 + 'px' }}></img>
                    <img className="icons" src={dotsImage} alt="" style={{ margin: 10 + 'px' }}></img>
                </div>
            </div>
            <div id="chatSection" ref={chatSection} className="chatSection">
                {chatMessages && chatMessages.map((message, idx) => {
                    return <MessageModal key={idx} message={message} userId={currentUser._id} />
                })}
            </div>
            <div className="bottomBar">
                <div className="leftPart">
                    <img id="toggleEmoji" onClick={emojiApi} className="icons" src={happyImage} alt=""></img>
                    <form className="profileForm" method="post" encType="multipart/form-data" action="/uploadProfilePic">
                        <input id="selectChatImage" onChange={sendImageInChat} type="file" name="file" accept="image/*" required></input>
                    </form>
                    <label htmlFor="selectChatImage">
                        <img id="chooseMedia" className="icons" src={linkImage} alt=""></img>
                    </label>
                </div>
                <div className="searchBarCont">
                    <input value={messageText} onChange={(e) => { setMessageText(e.target.value) }} onKeyUp={(e) => typingMessage(e)} id="messageBox" type="text" placeholder="type a message..."></input>
                </div>
                <img className="icons microphone" src={micImage} alt=""></img>
                <div id="emojiIconPicker" onClick={appendEmoji} className={openemojiDialog ? 'active' : null}>
                    <ul id="emojiList">
                        {emojis && emojis.map((emoji, idx) => {
                            return <li key={idx} emoji-name={emoji.slug}>{emoji.character}</li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default RightPart;
