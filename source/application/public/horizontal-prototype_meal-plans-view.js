import { AppRegistry } from 'react-native';

import MealPlansView from '../pages/horizontal-prototype/MealPlansView.jsx';

AppRegistry.registerComponent('MealPlansView', () => MealPlansView);

AppRegistry.runApplication('MealPlansView', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});