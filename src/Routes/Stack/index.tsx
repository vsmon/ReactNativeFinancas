import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import Home from '../../Pages/Home';
import InsertTransaction from '../../Pages/InsertTransactions';

export type StackParamList = {
  Home: any;
  InsertTransaction: any;
};

export interface IStackNavigationProps {
  navigation: NativeStackNavigationProp<StackParamList>;
}

const Stack = createNativeStackNavigator<StackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: true, title: ''}}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen name="InsertTransaction" component={InsertTransaction} />
    </Stack.Navigator>
  );
}
