import React from 'react';
import {connect} from 'react-redux';
import Message from './components/message';
import Counter from './components/counter';
import {
  decrease,
  increase
} from './redux/counter';


class Container extends React.Component {
  render() {
    const {actions, message, counter} = this.props;

    return (
      <span>
        <Message show={message} />
        <Counter
          count={counter}
          decrease={actions.decrease}
          increase={actions.increase} />
      </span>
    );
  }
}

const selector = ({message, counter}) => {
  return {
    message,
    counter: counter.count
  };
};

const bindings = (dispatch) => {
  return {
    actions: {
      decrease: () => dispatch(decrease()),
      increase: () => dispatch(increase())
    }
  };
};

export default connect(selector, bindings)(Container);
