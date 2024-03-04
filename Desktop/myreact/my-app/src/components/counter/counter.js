import React, { Component } from "react";

class Counters extends Component {
  state = {
    count: 0
  };

  handleIncrement = () => {
    this.setState((prevState) => {
      return { count: prevState.count + 1 };
    });
  };

  handleDecrement = () => {
    this.setState((prevState) => {
      return { count: prevState.count - 1 };
    });
  };

  render() {
    const { count } = this.state;

    return (
      <div>
        <h1>{count}</h1>
        <button onClick={this.handleIncrement}>Increment</button>
        <button onClick={this.handleDecrement}>Decrement</button>
      </div>
    );
  }
}

export default Counters;
