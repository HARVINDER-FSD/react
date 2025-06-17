import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../services/firebase'

const Showproduct = () => {

    const [data,setData] = useState([])

    function fetchData()
    {
        getDocs(collection(db,"products"))
        .then((res)=> {
            let filterData =  res.docs.map((el)=>({...el.data(),id:el.id}))
            console.log(filterData)
            setData(filterData)
        })
        .catch((err)=>console.log(err))
    }

    useEffect(()=>{
        fetchData();
    },[])

  return (
    <div>
        <h1>Show Products</h1>

        {
            data.map((el)=>(
                <div key={el.id}>
               
                    <img src={el.image} height={200} width={200} />
           
                <p>{el.description}</p>
                <p>{el.title}</p>
                <p>{el.price}</p>
                </div>
            ))
        }

    </div>
  )
}

export default Showproduct