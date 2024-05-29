import { AppRegistry } from 'react-native';

import Consumption from '../pages/horizontal-prototype/Consumption.jsx';

AppRegistry.registerComponent('Consumption', () => Consumption);

AppRegistry.runApplication('Consumption', {
  initialProps: {},
  rootTag: document.getElementById('react-root'),
});
