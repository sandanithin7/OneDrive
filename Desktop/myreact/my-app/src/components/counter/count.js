import { Component } from "react";

class Bhagavan extends Component{


state={count:0}

    handlePat=()=>{
this.setState((nithin)=>{
return{

    count:nithin.count+1
}


})




    }


render(){
const{count}=this.state

    return(


<div>
    <h1>
        {count}
    </h1>
    <button onClick={this.handlePat}>increment</button>
    <button onClick={this.handlePat}>decrement</button>
</div>


    )
}

}

export default Bhagavan