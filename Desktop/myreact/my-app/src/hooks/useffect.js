
import  Axios  from "axios"
import { useEffect, useState } from "react"

const UseEffectEx =()=>{

    const[list,udatelist]=useState()
    useEffect(()=>{
fetchDate()
console.log("component mount")

    },[])   



    //this function is for fetching server to client
    const fetchDate=()=>{
//install npm i axios

Axios.get("https://fakestoreapi.com/products")
.then(response=>{
    if(response.status===200){

        udatelist(response.data)
    }
    })
    }
return(
    <>
    <h1>
        useEffect
    </h1>
    {
       list && list.length > 0 ? list.map((product)=><Aoflist key={list.id} data={product}></Aoflist>)
       :
       null
    }
    
    </>
)
}

  export default UseEffectEx 
  export const Aoflist=({data})=>{
    return(
      
      <h1>
        {data.price}
      </h1>
    )
  }
