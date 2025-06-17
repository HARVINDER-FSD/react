import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../Services/firebase'
import { signOut } from 'firebase/auth'

const Navbar = () => {

    function handleclick()
    {
        signOut(auth)
        .then((res)=>{console.log(res)

            alert('logout')
        }).catch((err)=>console.log(err))
    }

  return (
    <div style={{display:'flex', justifyContent:'space-around'}}>

        <Link to={'/'}> Home </Link>
        <Link to={'/Products'}> Products </Link>
        <Link to={'/login'}> Login </Link>

        <button onClick={handleclick}>Logout</button>

    </div>
  )
}

export default Navbar