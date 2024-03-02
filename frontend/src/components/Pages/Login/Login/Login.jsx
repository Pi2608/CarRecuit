import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"


function Login() {
  //const [email, setEmail] = useState('')
  const [googleUser, setGoogleUser] = useState('')

  function handleCallbackResponse(response) {
    //document.getElementById('google').hidden = true
    console.log(response.credential);
    var userOject = jwtDecode(response.credential)
    console.log(userOject)
    //setGoogleUser(userOject)
    //setEmail(userOject.email)
  }


  useEffect(() => {
    /*global google*/

    google.accounts.id.initialize({
      client_id: '967060194344-lb9v3m4hc7lov2q4cq6dagvr3gd06ce3.apps.googleusercontent.com',
      callback: handleCallbackResponse
    })

    google.accounts.id.renderButton(document.getElementById('google'), {
      theme: 'outline',
      size: 'larger'
    })
  },);
   /* useEffect(() => {
      async function fetchUsers(){
        const response = await axios.get('http://localhost:3000/users/' +email)
         if(response.data){
            if(response.data.Status == "Inactive"){
              alert("Tài khoản của bạn đã bị vô hiệu hóa " + "\n Lý do: " + response.data.ReasonBlocked)
            } else {
              sessionStorage.setItem('loginedUser', JSON.stringify(response.data))
            }
         } else {
          await axios.post(
            'http://localhost:3000/users/new/?name=' + googleUser.name + '&email=' + googleUser.email + '&picture=' + googleUser.picture
          )
          await fetchUsers()
         }
         window.location.reload()
      }
      if(email != ''){
        fetchUsers()
      }
    })*/
  
  return (
    <div 
    id="google"
    style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
    }}>
    </div>
  )
  }

export default Login;