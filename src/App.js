import './App.css';
import LoginPage from './components/loginPage';
import ChatPage from './components/chatPage';
import ReactDOM from "react-dom/client";
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import io from 'socket.io-client';
const socket = io('http://localhost:3000',{ transports : ['websocket'] });

export {socket};

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}></Route>
        <Route exact path="/chat" element={<ChatPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
