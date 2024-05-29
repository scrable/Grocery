import { AppRegistry } from 'react-native';

import RecipesView from '../pages/horizontal-prototype/RecipesView.jsx';

AppRegistry.registerComponent('RecipesView', () => RecipesView);

AppRegistry.runApplication('RecipesView', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
