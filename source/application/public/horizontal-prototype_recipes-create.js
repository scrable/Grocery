import { AppRegistry } from 'react-native';

import RecipesCreate from '../pages/horizontal-prototype/RecipesCreate.jsx';

AppRegistry.registerComponent('RecipesCreate', () => RecipesCreate);

AppRegistry.runApplication('RecipesCreate', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
