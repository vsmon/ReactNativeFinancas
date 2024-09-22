import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Realm from '../../database/realm/schemas';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {IStackNavigationProps} from '../../Routes/Stack';
import {useIsFocused} from '@react-navigation/native';

export interface IValues {
  key?: string;
  id: number;
  date: Date;
  type: string;
  description: string;
  value: number;
  recurrent: boolean;
  dateEnd: Date;
}

interface IValuesByMonth {
  id: number;
  date: Date;
  description: string;
  value: number;
}

const mockValues: IValues[] = [
  {
    id: 1,
    date: new Date(),
    type: 'outflow',
    description: 'Apto',
    value: 620.2,
    recurrent: true,
    dateEnd: new Date(),
  },
  {
    id: 2,
    date: new Date(),
    type: 'outflow',
    description: 'Condominio',
    value: 335.0,
    recurrent: true,
    dateEnd: new Date(),
  },
  {
    id: 3,
    date: new Date(),
    type: 'outflow',
    recurrent: true,
    value: 100.0,
    description: 'Internet',
    dateEnd: new Date(),
  },
  {
    id: 4,
    date: new Date(),
    type: 'outflow',
    recurrent: true,
    value: -100.0,
    description: 'Internet',
    dateEnd: new Date(),
  },
];

export default function Home({navigation}: IStackNavigationProps) {
  const [allValuesList, setAllValuesList] = useState<IValues[]>();
  const [groupValues, setGroupValues] = useState<IValues[]>();
  const [balance, setBalance] = useState<number>(0);
  const [groupTitle, setGroupTitle] = useState<string>('');

  useEffect(() => {
    getAllValues();
    sumAllValues();
    getValuesByMonth();
  }, [useIsFocused()]);

  function addValue(Values: IValues) {
    /* mockValues.push(Values);
    setValuesList([...mockValues]); */

    Realm.write(() => {
      Realm.create('Values', Values);
    });
    getAllValues();
    sumAllValues();
  }
  function getAllValues() {
    const values: any = Realm.objects('Values');
    setAllValuesList([...values]);
  }

  function deleteAllValues() {
    const values: any = Realm.objects('Values');
    Realm.write(() => {
      Realm.delete(values);
    });
  }

  function sumAllValues() {
    const transactions: IValues[] | any = Realm.objects<IValues>('Values');
    const sumTransactions = transactions.reduce(
      (accum: any, next: any) => accum + next.value,
      0,
    );

    setBalance(sumTransactions);
  }

  function getValuesByMonth() {
    const transactions: any = Realm.objects<IValues>('Values');
    const listResult: IValues[] = [];

    transactions.forEach((transaction: IValues) => {
      const key: string = `${
        transaction.date.getMonth() + 1
      }${transaction.date.getFullYear()}${transaction.description}`;

      const existingItem = listResult.find(item => {
        const keyItem: string = `${
          item.date.getMonth() + 1
        }${item.date.getFullYear()}${item.description}`;
        return keyItem === key;
      });

      if (existingItem) {
        existingItem.value += transaction.value;
      } else {
        listResult.push({...transaction});
      }
    });
    setGroupTitle('By Month');
    setGroupValues(listResult);
    return listResult;
  }

  function getValuesByYear() {
    const transactions: any = Realm.objects<IValues>('Values');
    const listByYear: IValues[] = [];

    transactions.forEach((transaction: IValues) => {
      const key = transaction.date.getFullYear() + transaction.description;

      const transactionIndex = listByYear.findIndex(
        tr => tr.date.getFullYear() + tr.description === key,
      );

      if (transactionIndex === -1) {
        listByYear.push({...transaction});
      } else {
        listByYear[transactionIndex].value += transaction.value;
      }
    });
    setGroupTitle('By Year');
    setGroupValues(listByYear);
    return listByYear;
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.balanceContainer}>
        <Text>Saldo</Text>
        <Text style={styles.textBalance}>
          {/* R$ {mockValues.reduce((prev, next) => prev + next.value, 0)} */}
          {balance}
        </Text>
      </View>
      <Icon
        style={{alignSelf: 'flex-end'}}
        name="plus"
        color="#000"
        size={35}
        onPress={
          () => navigation.navigate('InsertTransaction')
          /* addValue({
            id: Realm.objects('Values').length + 1,
            date: new Date('2025-10-14'),
            type: 'outflow',
            recurrent: true,
            value: 100.0,
            description: 'Test3', //+ new Date().getSeconds().toString(),
            dateEnd: new Date(),
          }) */
        }
      />
      <View style={{flexDirection: 'row'}}>
        <Icon
          name="reload"
          size={30}
          color={'red'}
          onPress={getValuesByMonth}
        />
        <Icon
          name="reload"
          size={30}
          color={'blue'}
          onPress={getValuesByYear}
        />
        <Icon name="delete" size={30} color={'red'} onPress={deleteAllValues} />
        <Icon
          name="page-next"
          size={30}
          color={'red'}
          onPress={() => navigation.navigate('InsertTransaction')}
        />
      </View>
      <View>
        <Text>{groupTitle}</Text>
        <FlatList
          horizontal={true}
          data={groupValues}
          renderItem={({item, index}) => (
            <View style={styles.itemContainer}>
              <Text>Data</Text>
              <Text style={styles.textValues}>{`${
                item.date.getMonth() + 1
              }/${item.date.getFullYear()}`}</Text>
              <Text>Descrição</Text>
              <Text style={styles.textValues}>{item.description}</Text>
              <Text>Valor</Text>
              <Text style={styles.textValues}>R$ {item.value}</Text>
            </View>
          )}
          keyExtractor={key => String(key.id)}
        />
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={allValuesList}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text>{item.id}</Text>
              <Text>Data</Text>
              <Text style={styles.textValues}>
                {item.date.toLocaleDateString()}
              </Text>
              <Text>Descrição</Text>
              <Text style={styles.textValues}>{item.description}</Text>
              <Text>Valor</Text>
              <Text style={styles.textValues}>R$ {item.value}</Text>
            </View>
          )}
          keyExtractor={key => String(key.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textValues: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    margin: 5,
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 10,
    marginBottom: 30,
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  textBalance: {fontSize: 38},
});
