import { useRef } from "react";

function Print() {
  const ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    console.log(ref.current);
  }

  return (
    <>
      <h1>Counter: {ref.current}</h1>
      <button onClick={handleClick}>Click</button>
    </>
  );
}

export default Print;
