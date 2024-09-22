import React from 'react';
import Routes from './src/Routes/routes';
import {StatusBar} from 'react-native';

function App() {
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FFF'} />
      <Routes />
    </>
  );
}

export default App;
