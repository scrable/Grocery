import { AppRegistry } from 'react-native';

import MealPlans from '../pages/horizontal-prototype/MealPlans.jsx';

AppRegistry.registerComponent('MealPlans', () => MealPlans);

AppRegistry.runApplication('MealPlans', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});