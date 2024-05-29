import * as React from 'react';
import CreateReactClass from 'create-react-class';
import { connect } from 'react-redux';
import LocalizedStrings from 'react-localization';
import { Button, StyleSheet, Text, View } from 'react-native';

import { login } from '../../actions/product-prototype/auth';

let apiUrl = process.env.API_HOST || location.hostname;
if (process.env.API_PORT) {
  apiUrl += ':' + process.env.API_PORT;
}

let strings = new LocalizedStrings({
  en: {
    loggeg_in: 'Logged In: ',
    login: 'Login',
  },
});
const styles = StyleSheet.create({
  box: { padding: 10 },
  text: { fontWeight: 'bold' },
});
const mapStateToProps = (state) => {
  return {
    loggedIn: state.authReducer.loggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    reduxLogin: (trueFalse) => dispatch(login(trueFalse)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateReactClass({
  render: function() {
    return (
      <View style={styles.box}>
        <View style={styles.box}>
          <Text style={styles.text}>{strings.hello_world}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.text}>{strings.logged_in}</Text>
          <Text style={styles.text}>{`${this.props.loggedIn}`}</Text>
          <Button title={strings.login} onPress={this.props.loggedIn === false ? () => this.props.reduxLogin(true) : () => this.props.reduxLogin(false)} />
        </View>
      </View>
    );
  },
}));
