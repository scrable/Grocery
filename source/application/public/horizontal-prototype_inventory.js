import { AppRegistry } from 'react-native';

import Inventory from '../pages/horizontal-prototype/Inventory.jsx';

AppRegistry.registerComponent('Inventory', () => Inventory);

AppRegistry.runApplication('Inventory', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
