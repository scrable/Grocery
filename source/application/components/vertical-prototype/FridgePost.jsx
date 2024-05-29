import * as React from 'react';
import CreateReactClass from 'create-react-class';

let apiUrl = process.env.API_HOST || location.hostname;
if (process.env.API_PORT) {
  apiUrl += ':' + process.env.API_PORT;
}

export default React.createElement(CreateReactClass({
  getInitialState: function() {
    return {
      fridge_id: '',
      msg: 'ready',
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({
      msg: 'processing'
    });
    let url = location.protocol + '//' + apiUrl + '/v1/fridges';
    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fridge_id: this.state.fridge_id
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('error ' + res.status);
        }
        return res.text();
      })
      .then((data) => {
        this.setState({
          msg: 'success'
        });
      })
      .catch((err) => this.setState({
        msg: err
      }));
  },
  handleTextChange: function(e) {
    this.setState({
      fridge_id: e.target.value,
    });
  },
  handleReset: function() {
    this.setState({
      fridge_id: '',
      msg: 'waiting',
    });
  },
  render: function() {
    let msg;
    if (this.state.msg !== '') {
      msg = <p>{this.state.msg}</p>;
    } else {
      msg = '';
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <p><label>FridgePost</label></p>
        <p><input
          type='number'
          id='fridge_id'
          name='fridge_id'
          value={this.state.fridge_id}
          onChange={this.handleTextChange}
          required
        /></p>
        <p>
          <button id='btnSubmit'>Send</button>
          <button id='btnReset' onClick={this.handleReset}>Reset</button>
        </p>
        <code>{msg}</code>
      </form>
    );
  },
}));
