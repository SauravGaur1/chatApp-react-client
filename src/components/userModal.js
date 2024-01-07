import React from 'react';
import userImage from '../images/user.png'
import notification from '../images/notification.png'

const UserModal = ({ room, openChat }) => {
    return (
        <div id={room._id} className='userModel' onClick={(e) => openChat(room)} >
            <img className="userImage" src={room.profileUrl ? room.profileUrl : userImage} alt="vv"></img>
            <div className="userRightCont">
                <p>{room.roomname}</p>
                <p className="fadeText" >{room.lastMessage ? room.lastMessage.text + '...' + room.lastMessage.time : 'Start Conversation...'}</p>
            </div>
            <div>
                <img src={notification} className={room.notify?'displayInline icons':'icons displayNone'}></img>
            </div>
        </div>
    );
}

export default UserModal;
