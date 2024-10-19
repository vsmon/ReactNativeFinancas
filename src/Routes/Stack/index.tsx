import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import Home, {IValues} from '../../Pages/Home';
import InsertTransaction from '../../Pages/InsertTransactions';
import Transactions from '../../Pages/Transactions';
import {RouteProp} from '@react-navigation/native';

export type StackParamList = {
  Home: undefined;
  InsertTransaction: {values: IValues; edit: boolean} | undefined;
  Transactions: {type: 'inflow' | 'outflow'} | undefined;
};

export interface IStackNavigationProps {
  navigation: NativeStackNavigationProp<StackParamList>;
  route: RouteProp<StackParamList>;
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
      <Stack.Screen
        name="InsertTransaction"
        component={InsertTransaction}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Transactions"
        component={Transactions}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
}
