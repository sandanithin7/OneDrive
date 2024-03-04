import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { Component } from "react";

class Counterss extends Component {
state={count:0}




handleIncrement = () => {
    this.setState((previousState) => {
        return {
            count: previousState.count + 1
        };
    });
}

handleDecrement = () => {
    this.setState((prevState) => {
      return { count: prevState.count - 1 };
    });
  };




render(){
    const { count } = this.state;

    return (

        <div>
            <h1>
                {count}
            </h1>

            <button onClick={this.handleIncrement}>increment</button>
            <button onClick={this.handleDecrement}>decrement</button>






        </div>


    )
}




}

export default Counterss