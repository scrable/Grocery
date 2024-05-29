import { AppRegistry } from 'react-native';

import InventoryAddBarcode from '../pages/horizontal-prototype/InventoryAddBarcode.jsx';

AppRegistry.registerComponent('InventoryAddBarcode', () => InventoryAddBarcode);

AppRegistry.runApplication('InventoryAddBarcode', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
