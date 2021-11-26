/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
//import App from './App';
import React from 'react';
import App from './screens/index';
import {name as appName} from './app.json';
import {DefaultTheme,Provider as PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import store from './store';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#e57c0b',
    accent: '#9e1b95',
  },
  text:{
      color: '#000000'
  }
};

const Wrapper = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Wrapper);
