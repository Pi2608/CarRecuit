import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

export default function ResetPw() {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue3, setInputValue3] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };

    const handleCancel = () => {
        setInputValue1('');
        setInputValue2('');
        setInputValue3('');
    };

    return (
        <div id="reset-pw">
            <div className="container">
                <div className="title">
                    <h1>Đổi mật khẩu</h1>
                    <p>Vui lòng nhập mật khẩu hiện tại của bạn để thay đổi mật khẩu</p>
                </div>
                <div className="pw-container">
                    <label htmlFor="old-pw" className="box">
                        <p className="box-inner">Mật khẩu cũ</p>
                        <TextField
                        id="old-pw"
                        size="small"
                        value={inputValue1}
                        fullWidth
                        type={'password'}
                        onChange={(e) => setInputValue1(e.target.value)}
                        />
                    </label>
                    <label htmlFor="new-pw" className="box">
                        <p className="box-inner">Mật khẩu mới</p>
                        <TextField
                        id="new-pw"
                        size="small"
                        value={inputValue2}
                        fullWidth
                        type={'password'}
                        onChange={(e) => setInputValue2(e.target.value)}
                        />
                    </label>
                    <label htmlFor="confirm-pw" className="box">
                        <p className="box-inner">Xác nhận mật khẩu mới</p>
                        <TextField
                        id="confirm-pw"
                        size="small"
                        value={inputValue3}
                        fullWidth
                        type={'password'}
                        onChange={(e) => setInputValue3(e.target.value)}
                        />
                    </label>
                    <br />
                    <div className="submit">
                        <Button variant="outlined" onClick={handleCancel}>Hủy</Button>
                        <Button variant="contained">Save</Button>
                    </div>
                </div> 
            </div>
        </div>
    )
    
} 