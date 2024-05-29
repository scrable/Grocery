import { AppRegistry } from 'react-native';

import Splash from '../pages/horizontal-prototype/Users.jsx';

AppRegistry.registerComponent('Users', () => Splash);

AppRegistry.runApplication('Users', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});