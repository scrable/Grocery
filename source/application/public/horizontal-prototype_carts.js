import { AppRegistry } from 'react-native';

import Carts from '../pages/horizontal-prototype/Carts.jsx';

AppRegistry.registerComponent('Carts', () => Carts);

AppRegistry.runApplication('Carts', {
  initialProps: {},
  rootTag: document.getElementById('react-root'),
});
