import React from 'react';

const MessageModal = (props) => {
    return (
        <div>
            <div className={props.userId == props.message.sentby?'chatContainer sentCont':'chatContainer'}>
                    <p>{props.userId != props.message.sentby?props.message.sendername:null}</p>
                    <div className={props.userId == props.message.sentby?'chatMessage sent':'chatMessage'}>
                        {props.message.imageUrl?<img src={props.message.imageUrl} className="mssgImage"></img>:
                        <p>{props.message.text}</p>
                        }
                        <p className="mssgTime">{props.message.time}</p>
                    </div>
            </div>
        </div>
    );
}

export default MessageModal;
