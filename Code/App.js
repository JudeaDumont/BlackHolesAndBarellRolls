import React from 'react';
import {Provider} from 'react-redux';
import store from './src/createReduxStore';
import TheApp from './src/app';

//expo wants to use this file for mobile apps, 
//so just import the main app
//from the web app to use here

//hook up redux here since this is the actual root component

export default function App() {
  return <Provider store={store}><TheApp /></Provider>
}