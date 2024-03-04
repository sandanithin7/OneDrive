import { Component } from "react";
class Countting extends Component {
    State= {count :0 }

   
          
            handleClick=()=>{
                this.setState({
                    count:this.state.count+1
                })
              }
            

 render(){
const {count}=this.state

    return (
        <div>

            <h1>{count}</h1>
            <button onClick={this.handleText}>Increment</button>
            <button onClick={this.handleText} >Decrement</button>
        </div>

    )
}
}

export default Countting