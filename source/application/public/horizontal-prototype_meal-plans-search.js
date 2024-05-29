import { AppRegistry } from 'react-native';

import MealPlansSearch from '../pages/horizontal-prototype/MealPlansSearch.jsx';

AppRegistry.registerComponent('MealPlansSearch', () => MealPlansSearch);

AppRegistry.runApplication('MealPlansSearch', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
