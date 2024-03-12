import React,{ useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from "../Login/Login.jsx";
import { useAuth } from '../../../../Context/AuthProvider.jsx';
import {FaUser, FaLock, FaCookie } from 'react-icons/fa';
import axios from 'axios';
import "./LoginForm.css";

const LoginForm = () => {
  const userRef = useRef()

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(()=> {
    userRef.current.focus();
  },[])

  useEffect(()=> {
    setErrMsg("");
  },[email, pwd])

  async function handleSubmit(e){
    e.preventDefault();
    try {
      const postData = {
        email: email,
        password: pwd,
      }
      const response1 = await axios.get(`http://localhost:4000/user/email/${email}`)
      if(response1.data){
        const response2 = await axios.post(
          "http://localhost:4000/user/login",
          postData
        );
        const token = response2.data.token;
        // console.log(token)
        // Set the token in a cookie and update the authentication state
        login(token)

        setUser("")
        setPwd("")
      }
    }catch (err) {
      if(!err?.reponse){
        setErrMsg('No Sever Response')
      }else if(err.response?.status === 400){
        setErrMsg('Missing Usename or Password')
      }else if(err.response?.status === 401){
        setErrMsg('Unauthorized')
      }else{
        setErrMsg('Login Failed')
      }
    }
  }
  
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Đăng nhập</h1>
        <div className="input-box">
          <input
            type="text" 
            placeholder="Email/Số điện thoại" 
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required 
            />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input 
            type="password" 
            placeholder="Mật khẩu"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required 
            />
          <FaLock className="icon" />
        </div>
        <button type="submit">Đăng nhập</button>
        <div className="register-link">
          <p>
            Bạn chưa là thành viên? <a href="#">Đăng ký</a>
          </p>
        </div>
        <Login/>
      </form>
    </div>
  );
};

export default LoginForm