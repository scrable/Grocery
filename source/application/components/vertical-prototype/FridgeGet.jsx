import * as React from 'react';
import CreateReactClass from 'create-react-class';

let apiUrl = process.env.API_HOST || location.hostname;
if (process.env.API_PORT) {
  apiUrl += ':' + process.env.API_PORT;
}

export default React.createElement(CreateReactClass({
  getInitialState: function() {
    return {
      msg: 'ready',
    };
  },
  handleButtonClick: function(e) {
    let url = location.protocol + '//' + apiUrl + '/v1/fridges';
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('error ' + res.status);
        }
        return res.text();
      })
      .then((data) => {
        this.setState({
          msg: data
        });
      })
      .catch((err) => this.setState({
        msg: err
      }));
  },
  render: function() {
    let msg;
    if (this.state.msg !== '') {
      msg = <p>{this.state.msg}</p>;
    } else {
      msg = '';
    }
    return (
      <div>
        <p><label>FridgeGet</label></p>
        <button id='btnSubmit' onClick={this.handleButtonClick}>Request</button>
        <code>{msg}</code>
      </div>
    );
  },
}));
