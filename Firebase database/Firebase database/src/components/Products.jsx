import React, { useState } from 'react'
import { db } from '../services/firebase'
import { collection, addDoc } from "firebase/firestore"; 

const Products = () => {

    const initialState = {
        image : "",
        title : "",
        category : "",
        price  : "",
        description : ""
    }
    const [formdata,setFormData] = useState(initialState)


    function handleChange(e)
    {
        setFormData({...formdata,[e.target.name]:e.target.value})
    }

    function handleSubmit(e)
    {
        e.preventDefault();
        console.log(formdata)
        addDoc(collection(db,"products"),formdata)
        .then((res)=>console.log(res))
        .catch((err)=>console.log(err))
    }

    const {image,title,category,price,description} = formdata
    
  return (
    <div>
        
        <h1>Products</h1>


        <form onSubmit={(e)=>handleSubmit(e)}>
            <input type="text" name='image' value={image} placeholder='image' onChange={(e)=>handleChange(e)} />
            <input type="text" name='title' value={title} placeholder='title' onChange={(e)=>handleChange(e)}/>
            <select name='category' value={category} onChange={(e)=>handleChange(e)}>
                
                <option value=""> Select Category </option>
                <option value=" Men's Clothing"> Men's Clothing </option>
                <option value=" women's Clothing">  womens's Clothing </option>

            </select>

            <input type="text" name='price' value={price} placeholder='price' onChange={(e)=>handleChange(e)}/>
            <input type="text" name='description' value={description} placeholder='description'  onChange={(e)=>handleChange(e)}/>
            <input type="submit" />

        </form>


    </div>
  )
}

export default Products