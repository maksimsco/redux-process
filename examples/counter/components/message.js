import React from 'react';


class Message extends React.Component {
  static propTypes = {
    show: React.PropTypes.bool.isRequired
  };

  render() {
    const {show} = this.props;

    if (show) {
      return (
        <p>Congratulations, you've clicked 3 times. This message will close after 5 seconds.</p>
      );
    } else {
      return null;
    }
  }
}

export default Message;
