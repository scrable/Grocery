import { AppRegistry } from 'react-native';

import InventoryView from '../pages/horizontal-prototype/InventoryView.jsx';

AppRegistry.registerComponent('InventoryView', () => InventoryView);

AppRegistry.runApplication('InventoryView', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
