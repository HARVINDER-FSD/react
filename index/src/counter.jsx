import { useState } from "react";

function Counter() {
  const [value, setValue] = useState(0);

  function handleClick() {
    setValue(value + 1); 
  }

  return (
    <>
    <h1> counter:{value}</h1>
      <button onClick={handleClick}>click</button>
    </>
  );
}

export default Counter;
