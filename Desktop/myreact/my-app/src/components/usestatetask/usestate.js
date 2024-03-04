import { useState } from "react";


export const Circlera = () => {



    const [a, b] =useState(["list"])

    const addcircle = () => {

        const name = "a"
        b([...a, name])




    };


    
   
    return (
        <>

        

        <button onClick={addcircle}>add circle</button>


        {a.map((value)=><div style={{"width": "100px", "height": "100px", "background-color": "#3498db", "border-radius": "50%"}}></div>)}
        </>

    )
}
