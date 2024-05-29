import { AppRegistry } from 'react-native';

import CartsView from '../pages/horizontal-prototype/CartsView.jsx';

AppRegistry.registerComponent('CartsView', () => CartsView);

AppRegistry.runApplication('CartsView', {
  initialProps: {},
  rootTag: document.getElementById('react-root'),
});
