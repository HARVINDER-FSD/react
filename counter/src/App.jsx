
import { useState } from 'react'
import './App.css'

function App() {
  const [value,setvalue] = useState(0)
function decrement(){
setvalue(value - 1)
}
function reset(){
  setvalue(0)
  }
  function increment(){
    setvalue(value + 1)
    }
  return (
    <>
    <h1>counter</h1>
      <h1>{value} </h1>
      <button onClick={decrement} className='dec'>decriment</button>
      <button onClick={reset} className='res'>reset</button>
      <button onClick={increment} className='inc'>increment</button>
    </>
  )
}

export default App
