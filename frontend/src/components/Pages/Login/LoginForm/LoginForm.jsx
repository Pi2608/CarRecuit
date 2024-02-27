import React from 'react';
import {FaUser, FaLock } from 'react-icons/fa';
import Login from "../Login/Login.jsx";
import "./LoginForm.css";

const LoginForm = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Đăng nhập</h1>
        <div className="input-box">
          <input type="text" placeholder="Email/Số điện thoại" required />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Mật khẩu" required />
          <FaLock className="icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Ghi nhớ
          </label>
          <a href="#">Quên mật khẩu?</a>
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