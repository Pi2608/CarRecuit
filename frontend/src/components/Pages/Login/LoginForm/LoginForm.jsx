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
      console.log(response1)
      if(response1){
        let token
        const authentication = await axios.post(
          "http://localhost:4000/user/login",
          postData
        );
        console.log(authentication.data.status);
        if (authentication.data.status === 3 ){ 
          token = authentication.data.token;
          const authorization = await axios.get(`http://localhost:4000/user/getByToken?token=${token}`);
          const role = authorization.data.roleId;
          console.log(role);
          login(token,role);
          setUser("")
          setPwd("")
          setErrMsg("")
        }else if(authentication.data.status === 2 ){
          console.log(authentication.data.status);
          setErrMsg("Sai mật khẩu");
        }else{
          setErrMsg("Tài khoản không tồn tại");
        }
      }
    }catch (err) {
      if(!err?.reponse){
        setErrMsg('No Sever Response')
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
      </form>
    </div>
  );
};

export default LoginForm