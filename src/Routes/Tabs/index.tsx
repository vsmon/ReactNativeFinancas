import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Settings from '../../Pages/Settings';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Stack from '../Stack';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Main"
        component={Stack}
        options={{
          tabBarIcon: ({color}) => <Icon name="home" color={color} size={25} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({color}) => <Icon name="cog" color={color} size={25} />,
        }}
      />
    </Tab.Navigator>
  );
}
