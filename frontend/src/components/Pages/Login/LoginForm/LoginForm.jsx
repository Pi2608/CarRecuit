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

  const getAuth = async (token) => {
    try {
        const response = await axios.get(`http://localhost:4000/user/getByToken?token=${token}`);
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Authentication error: " + error.message);
    }
  } 

  async function handleSubmit(e){
    e.preventDefault();
    try {
      const postData = {
        email: email,
        password: pwd,
      }
      const response1 = await axios.get(`http://localhost:4000/user/email/${email}`)
      // console.log(response1)
      if(response1.data){
        let token
        const authentication = await axios.post(
          "http://localhost:4000/user/login",
          postData
        );
        // console.log(authentication.data.message);
        if (authentication.data.message !== "Đăng Nhập thất bại"){ 
          token = authentication.data.token;
          const authorization = await axios.get(`http://localhost:4000/user/getByToken?token=${token}`);
          const role = authorization.data.roleId;
          // console.log(role);
          login(token,role);
          setUser("")
          setPwd("")
          setErrMsg("")
        }else{
          setErrMsg("Sai mật khẩu")
        }
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
        <p style={{color: "red"}}>{errMsg ? errMsg : ""}</p>
        <div className="register-link">
          {/* <p>
            Bạn chưa là thành viên? <a href="#">Đăng ký</a>
          </p> */}
        </div>
        <Login/>
      </form>
    </div>
  );
};

export default LoginForm