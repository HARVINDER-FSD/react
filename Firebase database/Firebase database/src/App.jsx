import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Products from './components/Products'
import Showproduct from './components/Showproduct'

function App() {

  return (
    <>
        <Products/>
        <hr />
        <Showproduct/>
    </>
  )
}

export default App
