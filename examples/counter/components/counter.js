import React from 'react';


class Counter extends React.Component {
  render() {
    const {count, decrease, increase} = this.props;

    return (
      <div className="container">
        <h2>This is counter</h2>
        <p>Counter: <span className="count">{count}</span></p>
        <button className="button-decrease" onClick={decrease}>-</button>
        <button className="button-increase" onClick={increase}>+</button>
      </div>
    );
  }
}


export default Counter;
