import { AppRegistry } from 'react-native';

import ConsumptionView from '../pages/horizontal-prototype/ConsumptionView.jsx';

AppRegistry.registerComponent('ConsumptionView', () => ConsumptionView);

AppRegistry.runApplication('ConsumptionView', {
  initialProps: {},
  rootTag: document.getElementById('react-root'),
});
