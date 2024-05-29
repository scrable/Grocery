import { AppRegistry } from 'react-native';

import Recipes from '../pages/horizontal-prototype/Recipes.jsx';

AppRegistry.registerComponent('Recipes', () => Recipes);

AppRegistry.runApplication('Recipes', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
