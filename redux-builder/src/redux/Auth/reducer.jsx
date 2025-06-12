
import { SIGNIN, SIGNUP } from "../actionType"

const initialState ={
    user :[],
    currentUser:null,
    isAuth : false
}

export function reducer(state=initialState, {type,payload})
{
    switch(type)
    {
        case SIGNUP :
            return {user:[...state.user,payload],currentUser:null}

        case SIGNIN :
            return {...state,currentUser:payload,isAuth:true}

        default :
            return state
    }

}