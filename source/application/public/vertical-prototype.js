import ReactDOM from 'react-dom';

import FridgeGet from '../components/vertical-prototype/FridgeGet.jsx';
import FridgePost from '../components/vertical-prototype/FridgePost.jsx';

ReactDOM.hydrate(FridgeGet, document.getElementById('FridgeGet'));
ReactDOM.hydrate(FridgePost, document.getElementById('FridgePost'));
