import { AppRegistry } from 'react-native';

import InventoryAdd from '../pages/horizontal-prototype/InventoryAdd.jsx';

AppRegistry.registerComponent('InventoryAdd', () => InventoryAdd);

AppRegistry.runApplication('InventoryAdd', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
