import {signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import React from 'react'
import GoogleButton from 'react-google-button'
import { auth, provider } from '../Services/firebase'

const Login = () => {

    function handleClick()
    {
        signInWithPopup(auth,provider)
        .then((res)=>{
            console.log(res)
            alert("Login....")
        }).catch((err)=>console.log(err))
    }

  return (
    <div>

        <GoogleButton onClick={handleClick}/>

    </div>
  )
}

export default Login