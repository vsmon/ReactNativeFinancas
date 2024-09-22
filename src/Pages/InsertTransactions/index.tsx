import React from 'react';
import {View, Text} from 'react-native';

import Realm from '../../database/realm/schemas';
import {IValues} from '../Home';
import {IStackNavigationProps} from '../../Routes/Stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function InsertTransaction({navigation}: IStackNavigationProps) {
  function addValue(values: IValues) {
    Realm.write(() => {
      Realm.create('Values', values);
    });
  }

  function handleAddValue(values: IValues) {
    addValue(values);
    navigation.navigate('Home');
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Insert here...</Text>
      <Icon
        name="plus"
        size={50}
        onPress={() =>
          handleAddValue({
            id: Realm.objects('Values').length + 1,
            date: new Date('2025-10-14'),
            type: 'outflow',
            recurrent: true,
            value: 100.0,
            description: 'Test3', //+ new Date().getSeconds().toString(),
            dateEnd: new Date(),
          })
        }
      />
    </View>
  );
}
