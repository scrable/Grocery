import * as React from 'react';
import CreateReactClass from 'create-react-class';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '../../stores/product-prototype/store';
import Auth from './Auth.jsx';

export default CreateReactClass({
  render: function() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Auth />
        </PersistGate>
      </Provider>
    );
  },
});
