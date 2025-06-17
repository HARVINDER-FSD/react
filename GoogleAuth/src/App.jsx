import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Allroutes from './Allroutes'

function App() {
  

  return (
    <>
      <Navbar/>
      <hr />
      <Allroutes/>
    </>
  )
}

export default App
