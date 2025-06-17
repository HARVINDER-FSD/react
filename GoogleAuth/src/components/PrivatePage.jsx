import React, { use } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Services/firebase';

export const PrivatePage = ({children}) => {
    
    // const isAuth = false;

    const [user] = useAuthState(auth)
    // console.log(user)

    if(!user)
    {
        return <Navigate to={'/login'}/>
    }

    return children


}
