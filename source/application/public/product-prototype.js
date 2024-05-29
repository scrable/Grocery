import { AppRegistry } from 'react-native';

import App from '../pages/product-prototype/App.jsx';

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
