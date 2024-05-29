import { AppRegistry } from 'react-native';

import InventoryAddReceipt from '../pages/horizontal-prototype/InventoryAddReceipt.jsx';

AppRegistry.registerComponent('InventoryAddReceipt', () => InventoryAddReceipt);

AppRegistry.runApplication('InventoryAddReceipt', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
