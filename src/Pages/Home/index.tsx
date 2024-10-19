import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Realm from '../../database/realm/schemas';

import {IStackNavigationProps} from '../../Routes/Stack';
import {useIsFocused} from '@react-navigation/native';

import CardContainer from '../../Components/CardContainer';

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

export default function Home({navigation}: IStackNavigationProps) {
  const [allValuesList, setAllValuesList] = useState<IValues[]>();
  const [groupValues, setGroupValues] = useState<IValues[]>();
  const [balance, setBalance] = useState<number>(0);
  const [outflowTotal, setOutflowTotal] = useState<number>(0);
  const [inflowTotal, setInflowTotal] = useState<number>(0);
  const [groupTitle, setGroupTitle] = useState<string>('');

  useEffect(() => {
    getAllValues();
    sumOutFlow();
    sumInFlow();
    getValuesByYear();
    sumAllValues();
  }, [useIsFocused()]);

  function getAllValues() {
    const values: any = Realm.objects('Values');
    setAllValuesList([...values]);
  }

  function deleteAllValues() {
    const values: any = Realm.objects('Values');
    Realm.write(() => {
      Realm.delete(values);
    });
    Alert.alert('Deleted...');
  }
  function sumOutFlow() {
    const transactions: IValues[] | any = Realm.objects<IValues>('Values');

    const sumOutflow = transactions.reduce(
      (accum: number, next: IValues) =>
        next.value < 0 ? accum + next.value : accum,
      0,
    );
    setOutflowTotal(sumOutflow);
  }

  function sumInFlow() {
    const transactions: IValues[] | any = Realm.objects<IValues>('Values');

    const sumInflow = transactions.reduce(
      (accum: number, next: IValues) =>
        next.value > 0 ? accum + next.value : accum,
      0,
    );
    setInflowTotal(sumInflow);
  }

  function sumAllValues() {
    const transactions: IValues[] | any = Realm.objects<IValues>('Values');
    const sumTransactions = transactions.reduce(
      (accum: number, next: IValues) => accum + next.value,
      0,
    );

    setBalance(sumTransactions.toFixed(2));
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
      <Pressable
        onPress={() => navigation.navigate('Transactions', {type: 'inflow'})}>
        <CardContainer type="inflow">
          <Text>Total Receitas</Text>
          <Text style={styles.textValuesBalance}>R$ {inflowTotal}</Text>
        </CardContainer>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('Transactions', {type: 'outflow'})}>
        <CardContainer type="outflow">
          <Text>Total Despesas</Text>
          <Text style={styles.textValuesBalance}>R$ {outflowTotal}</Text>
        </CardContainer>
      </Pressable>
      <Pressable>
        <CardContainer>
          <Text>Saldo</Text>
          <Text
            style={[
              styles.textValuesBalance,
              {color: balance < 0 ? 'red' : '#0009'},
            ]}>
            R$ {balance}
          </Text>
        </CardContainer>
      </Pressable>
      <Icon
        style={{alignSelf: 'flex-end'}}
        name="plus"
        color="#000"
        size={35}
        onPress={() => navigation.navigate('Transactions')}
      />
      <View style={{flexDirection: 'row'}}>
        <Pressable
          style={[
            styles.groupBy,
            {
              backgroundColor: groupTitle === 'By Month' ? 'gray' : 'lightgray',
            },
          ]}
          onPress={getValuesByMonth}>
          <Text>By Month</Text>
        </Pressable>
        <Pressable
          style={[
            styles.groupBy,
            {
              backgroundColor: groupTitle === 'By Year' ? 'gray' : 'lightgray',
            },
          ]}
          onPress={getValuesByYear}>
          <Text>By Year</Text>
        </Pressable>
        <Pressable
          disabled={false}
          style={styles.groupBy}
          onPress={getValuesByYear}>
          <Text>Delete All</Text>
          <Icon
            name="delete"
            size={30}
            color={'red'}
            onPress={() =>
              Alert.alert('Excluir todos', 'Deseja excluir todos registros?', [
                {text: 'OK', onPress: deleteAllValues},
                {
                  text: 'Cancelar',
                  style: 'cancel',
                  onPress: () => console.log('canceled'),
                },
              ])
            }
          />
        </Pressable>
      </View>
      <FlatList
        //numColumns={3}
        horizontal={true}
        data={groupValues}
        renderItem={({item, index}) => (
          <CardContainer type={item.value < 0 ? 'outflow' : 'inflow'}>
            <Text>Data</Text>
            <Text style={styles.textValuesGroup}>{`${
              item.date.getMonth() + 1
            }/${item.date.getFullYear()}`}</Text>
            <Text>Descrição</Text>
            <Text style={styles.textValuesGroup}>{item.description}</Text>
            <Text>Valor</Text>
            <Text style={styles.textValuesGroup}>
              R$ {item.value.toFixed(2)}
            </Text>
            <Text style={styles.textValuesGroup}>Type {item.type}</Text>
          </CardContainer>
        )}
        keyExtractor={key => String(key.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textValuesGroup: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0008',
  },
  itemContainer: {
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
  textValuesBalance: {fontSize: 38, color: '#0008'},
  groupBy: {
    backgroundColor: 'lightgray',
    borderRadius: 25,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
});
