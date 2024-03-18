import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../../../../Context/AuthProvider";
import { Button, TextField } from "@mui/material";
import Popup from "reactjs-popup";
import axios from "axios";
import "./ResetPw.css"

export default function ResetPw() {

    const { id } = useAuth();

    const [pwd, setPwd] = useState('');

    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue3, setInputValue3] = useState('');

    const [msg, setMsg] = useState('');
    const [checkNewPwd, setCheckNewPwd] = useState(true);

    const handleCancel = () => {
        setInputValue1('');
        setInputValue2('');
        setInputValue3('');
        setCheckNewPwd(true); 
    };

    async function getPwd(){
        try {
            const response = await axios.get(`http://localhost:4000/user/${id}`);
            const data = response.data;
            setPwd(data.password);
        } catch (error) {
            console.error("Error getting info: " + error.message);
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        try {
            const postData ={
                oldPass: inputValue1,
                newPass: inputValue2
            }
            const response = await axios.post(`http://localhost:4000/user/changePass/${id}`, postData);
            const data = response.data;
            setMsg(data.message + "!");
            console.log(data.message);
            setInputValue1('');
            setInputValue2('');
            setInputValue3('');
            setCheckNewPwd(true); 
        } catch (error) {
            console.error("Error changing password: " + error.message);
        }
    }

    function checkNewPassword(e){
        const input = e.target.value;
        setInputValue3(e.target.value);
        if(input === inputValue2){ setCheckNewPwd(true); } 
        else{ setCheckNewPwd(false); }
    }

    useEffect(() => {
        getPwd();
    },[])

    return (
        <div id="reset-pw">
            <form type="submit" className="container" onSubmit={(e) => handleSubmit(e)}>
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
                        onChange={(e) => checkNewPassword(e)}
                        error={!checkNewPwd}
                        helperText={checkNewPwd ? "" : "Mật khẩu không khớp" }
                        />
                    </label>
                    <br />
                    <br />
                    <div className="submit">
                        <Button variant="outlined" onClick={handleCancel}>Hủy</Button>
                        <Popup
                            trigger={
                                <Button type="submit" disabled={!(checkNewPwd && inputValue1 && inputValue2 && inputValue3)} variant="contained">Save</Button>
                            }
                            contentStyle={{
                                backgroundColor: '#fff',
                                height: 'fit-content',
                                width: '30em', 
                                borderRadius: "15px"
                            }}
                            modal
                            position="top left"
                        >
                            {close =>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1em"}}>
                                    <h1 style={{padding: "0 0 1em 0"}}>{msg ? msg : ""}</h1>
                                    <div style={{width: "100%", padding: "1em 0", textAlign: "center", borderRadius: "5px", background:"#5fcf86"}}
                                        onMouseOut={(e) => {e.target.style.backgroundColor = "#5fcf86"}}
                                        onMouseOver={(e) => {e.target.style.backgroundColor = "#469963"}}
                                        onClick={close}
                                    >OK</div>
                                </div>
                            }
                        </Popup>
                    </div>
                </div> 
            </form>
        </div>
    )
} 