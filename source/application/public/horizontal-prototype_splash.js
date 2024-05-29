import { AppRegistry } from 'react-native';

import Splash from '../pages/horizontal-prototype/Splash.jsx';

AppRegistry.registerComponent('Splash', () => Splash);

AppRegistry.runApplication('Splash', {
  initialProps: {},
  rootTag: document.getElementById('react-root')
});
