import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Products = () => {

    const [data,setData] = useState([])
    function fetchData()
    {
        axios.get('https://fakestoreapi.com/products')
        .then((res)=>setData(res.data))
        .catch((err)=>console.log(err))
    }

    useEffect(()=>{
        fetchData();
    },[])

  return (
    <div>
        <h1>Products</h1>
        {data.map((el)=>(
            
            <div key={el.id}>
                <img src={el.image} height={200} width={200}/>
            </div>
        ))}
    </div>
  )
}

export default Products