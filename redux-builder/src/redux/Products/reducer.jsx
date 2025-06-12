import { data } from "react-router-dom";
import { REJECT, REQUEST, SUCCESS } from "../actionType";


const initialState = {
    isLoading : false,
    isError : false,
    data : []
}


export function reducer(state=initialState,{type,payload})
{
    switch(type)
    {
        case REQUEST :
            return {...state,isLoading:true,isError:false}
        
        case SUCCESS :
            return {...state, isLoading:false, data:payload}
        
        case REJECT :
            return {...state, isLoading:true,isError:true}        
        default : 
            return state
    }
}   