import React,{ useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import "./Login.css"

export default function Login(){

    const naviagte = useNavigate();

    function handleCallbackResponse(response){
        var userObject = jwt_decode(response.credential);
        console.log(userObject);
    }

    useEffect(()=>{
        /*global google*/
        google.accounts.id.initialize({
            client_id: "64727673726-vstd3tfnlso7nctvu6pp4s4fdmsu52h3.apps.googleusercontent.com",
            callBack: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("google-login"),
            {theme: "outline", size: "large"}
        );

    }, []);

    return(
        <div id="login">
            <h1>Hi there</h1>
            <div id="google-login" onClick={() => naviagte("/")}></div>
        </div>
    )
}