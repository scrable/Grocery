import { AppRegistry } from 'react-native';

import InventorySearch from '../pages/horizontal-prototype/InventorySearch.jsx';

AppRegistry.registerComponent('InventorySearch', () => InventorySearch);

AppRegistry.runApplication('InventorySearch', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
