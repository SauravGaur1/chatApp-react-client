import React, {useState,useEffect} from 'react';
import '../cssFiles/loginPage.css'
import axios from 'axios';
import { useJwt } from 'react-jwt';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const nav = useNavigate();
    const { decodedToken, isExpired } = useJwt(Cookies.get('jwt'));
     
    if(decodedToken){
        nav('/chat');
    }

    // console.log(decodedToken);
    
    function handleContinue(){
        let user = {
            username,
            password
        }
        if(username && password){
            axios.post('http://localhost:3000/login',user,{
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            .then((response)=>{
                console.log(response);
                console.log(response.data.status == 'success')
                if(response.data.status == 'success')
                    nav('/chat');
            })
            .catch((error)=>{
                console.log(error);
            });
        }
    }

    return (
        <div>
            <div className="mainContainer">
                <div className="greenStrip"></div>
                <div className="whiteStrip"></div>
            </div>
            <div className="centeredContainer">
                <div className="form">
                        <input id="username" onChange={(e)=>{setUsername(e.target.value)}} type="text" name="username" value={username} placeholder="username" required/>
                        <input id="password" onChange={(e)=>{setPassword(e.target.value)}} type="password" name="password" value={password} placeholder="password" required/>
                        <button id="continueButton" onClick={handleContinue}>Continue</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
