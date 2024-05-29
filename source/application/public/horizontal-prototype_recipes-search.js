import { AppRegistry } from 'react-native';

import RecipesSearch from '../pages/horizontal-prototype/RecipesSearch.jsx';

AppRegistry.registerComponent('RecipesSearch', () => RecipesSearch);

AppRegistry.runApplication('RecipesSearch', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
