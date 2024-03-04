import { useState } from "react";

export const UseStateex12=()=>{


const[current,updaterfunction]=useState(0)

const handleCountincrement=()=>{

updaterfunction(current+1)

}

const handleCounterdecrement=()=>{

updaterfunction(current-1)

}

return(
<>
<h1>{current}</h1>
<button onClick={handleCountincrement}>increment</button>
<button onClick={handleCounterdecrement}>decrement</button>
</>
)



}



