import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Realm from '../../database/realm/schemas';

import {IStackNavigationProps} from '../../Routes/Stack';
import {useIsFocused} from '@react-navigation/native';

import CardContainer from '../../Components/CardContainer';

import {getBitcoinAmountBlockCypher, getBitcoinPrice} from '../../Services';
import {Bar, CartesianChart, Line} from 'victory-native';
import {useFont} from '@shopify/react-native-skia';
import TransactionsChart from '../../Components/TransactionsChart';
import FlowChart from '../../Components/FlowChart';
import InflowChart from '../../Components/InflowChart';
import OutflowChart from '../../Components/OutflowChart';

export interface IValues {
  key?: string;
  id: number;
  date: Date;
  serializedDate?: string;
  type: string;
  description: string;
  value: number;
  recurrent: boolean;
  dateEnd: Date;
  recurrentId: number;
  assetType: string;
  assetLabel?: string;
  percentage?: number;
}

export interface IBitcoinData {
  id: number;
  address: string;
  price: number;
  balance: number;
  profit: number;
  currency: string;
}

export interface IAssetType {
  id: number;
  label: string;
  value: string;
}
export default function Home({navigation}: IStackNavigationProps) {
  const [allValuesList, setAllValuesList] = useState<IValues[]>([]);
  const [groupValues, setGroupValues] = useState<IValues[]>([]);
  const [yearList, setYearList] = useState<number[]>();
  const [balance, setBalance] = useState<number>(0);
  const [outflowTotal, setOutflowTotal] = useState<number>(0);
  const [inflowTotal, setInflowTotal] = useState<number>(0);
  const [groupTitle, setGroupTitle] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadValues();
  }, [useIsFocused()]);

  useEffect(() => {
    loadValues();
  }, [selectedYear]);

  useEffect(() => {
    const reloadBitcoinPrice = async () => await updateBitcoinPrice();
    reloadBitcoinPrice();
  }, []);

  function loadValues() {
    getAllValues();
    sumOutFlow();
    sumInFlow();
    getValuesByYear();
    sumAllValues();
    groupByYear();
  }

  function getAllValues() {
    const values: any = Realm.objects('Values');
    setAllValuesList([...values]);
    //console.log('values===========', values);
  }

  function getValuesByYearDB(): IValues[] {
    const transactions: IValues[] | any = Realm.objects<IValues>(
      'Values',
    ).filtered(
      `
  date >= $0 AND date < $1
`,
      new Date(`${selectedYear}-01-01T00:00:00.000Z`),
      new Date(`${selectedYear + 1}-01-01T00:00:00.000Z`),
    );
    //console.log(transactions);
    return transactions;
  }

  function deleteAllValues() {
    const values: any = Realm.objects('Values');
    Realm.write(() => {
      Realm.delete(values);
    });
    Alert.alert('Deleted...');
  }
  function sumOutFlow() {
    const transactions: IValues[] | any = getValuesByYearDB();

    const sumOutflow = transactions.reduce(
      (accum: number, next: IValues) =>
        next.value < 0 ? accum + next.value : accum,
      0,
    );
    setOutflowTotal(sumOutflow);
  }

  function sumInFlow() {
    const transactions: IValues[] | any = getValuesByYearDB();

    const sumInflow = transactions.reduce(
      (accum: number, next: IValues) =>
        next.value > 0 ? accum + next.value : accum,
      0,
    );
    setInflowTotal(sumInflow);
  }

  function sumAllValues() {
    const transactions: IValues[] | any = getValuesByYearDB();
    const sumTransactions = transactions.reduce(
      (accum: number, next: IValues) => accum + next.value,
      0,
    );

    setBalance(sumTransactions.toFixed(2));
  }

  function groupByYear() {
    const values: any = Realm.objects('Values');
    const groupByYear = values?.reduce(
      (acc: number[], item: {date: {getFullYear: () => number}}) => {
        const year: number = item.date.getFullYear(); // Extrai o ano da data

        const yearIndex = acc.findIndex(
          (yearItem: number) => yearItem === year,
        );

        if (!acc[yearIndex]) {
          acc.push(year);
        }

        return acc;
      },
      [] as number[],
    );
    setYearList(groupByYear);
  }

  function getValuesByMonth() {
    const transactions: any = getValuesByYearDB();
    const listByMonth: IValues[] = [];

    transactions.forEach((transaction: IValues) => {
      const key: string = `${
        transaction.date.getMonth() + 1
      }${transaction.date.getFullYear()}${transaction.assetType}`;

      const existingItem = listByMonth.find(item => {
        const keyItem: string = `${
          item.date.getMonth() + 1
        }${item.date.getFullYear()}${item.assetType}`;
        return keyItem === key;
      });

      if (existingItem) {
        existingItem.value += transaction.value;
      } else {
        listByMonth.push({...transaction});
      }
    });

    const sumInFlowByMonth: number = listByMonth.reduce((accum, curr) => {
      accum += curr.value > 0 ? curr.value : 0;
      return accum;
    }, 0);
    const sumOutFlowByMonth: number = listByMonth.reduce((accum, curr) => {
      accum += curr.value < 0 ? curr.value : 0;
      return accum;
    }, 0);
    setGroupTitle('By Month');
    setGroupValues(listByMonth);
    setInflowTotal(sumInFlowByMonth);
    setOutflowTotal(sumOutFlowByMonth);
    return listByMonth;
  }

  function getValuesByYear() {
    const transactions: any = getValuesByYearDB();
    const listByYear: IValues[] = [];

    transactions.forEach((transaction: IValues) => {
      const key = transaction.date.getFullYear() + transaction.assetType;

      const transactionIndex = listByYear.findIndex(
        tr => tr.date.getFullYear() + tr.assetType === key,
      );

      if (transactionIndex === -1) {
        listByYear.push({...transaction});
      } else {
        listByYear[transactionIndex].value += transaction.value;
      }
    });
    const sumInFlowByYear: number = listByYear.reduce((accum, curr) => {
      accum += curr.value > 0 ? curr.value : 0;
      return accum;
    }, 0);
    const sumOutFlowByYear: number = listByYear.reduce((accum, curr) => {
      accum += curr.value < 0 ? curr.value : 0;
      return accum;
    }, 0);

    setGroupTitle('By Year');
    setGroupValues(listByYear);
    setInflowTotal(sumInFlowByYear);
    setOutflowTotal(sumOutFlowByYear);

    return listByYear;
  }

  async function handleBitcoinBalance(): Promise<number> {
    try {
      const bitcoinData: IBitcoinData[] | any =
        Realm.objects<IBitcoinData>('BitcoinData');

      if (bitcoinData.lenght === 0) {
        throw new Error('No Bitcoin address found');
      }
      const {address, currency}: IBitcoinData =
        bitcoinData[bitcoinData.length - 1];

      const bitcoinAmount: number = await getBitcoinAmountBlockCypher(address);
      //const bitcoinAmount: number = 0.00001;

      const bitcoinPrice: number = await getBitcoinPrice(currency);
      //const bitcoinPrice: number = new Date().getTime();

      const bitcoinBalance: number = bitcoinAmount * bitcoinPrice;

      return bitcoinBalance;
    } catch (error) {
      console.log('Error get Bitcoin Data', error);
      return 0;
    }
  }

  async function updateBitcoinPrice() {
    try {
      const transactions: IValues[] | any = Realm.objects<IBitcoinData>(
        'Values',
      ).filtered(`assetType = 'bitcoin'`);

      const bitcoinBalance: number = await handleBitcoinBalance();

      console.log('passei bitcoinBalance=========', bitcoinBalance);

      if (bitcoinBalance !== 0) {
        transactions.forEach((transaction: IValues) => {
          Realm.write(() => {
            transaction.value = Number(bitcoinBalance.toFixed(2));
          });
        });
      }
    } catch (error) {
      console.log('Error update Bitcoin Price', error);
    }
  }

  async function handleReload() {
    setIsRefreshing(true);
    await updateBitcoinPrice();
    loadValues();
    setIsRefreshing(false);
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleReload} />
      }>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <CardContainer
          type="inflow"
          onPress={() =>
            navigation.navigate('Transactions', {type: 'inflow', selectedYear})
          }>
          <Text style={styles.textTitle}>Total Receitas</Text>
          <Text style={styles.textValuesBalance}>R$ {inflowTotal}</Text>
        </CardContainer>

        <CardContainer
          type="outflow"
          onPress={() =>
            navigation.navigate('Transactions', {type: 'outflow', selectedYear})
          }>
          <Text style={styles.textTitle}>Total Despesas</Text>
          <Text style={styles.textValuesBalance}>R$ {outflowTotal}</Text>
        </CardContainer>

        <CardContainer>
          <Text style={styles.textTitle}>Saldo</Text>
          <Text
            style={[
              styles.textValuesBalance,
              {color: balance < 0 ? 'red' : '#0009'},
            ]}>
            R$ {balance}
          </Text>
        </CardContainer>
        <Icon
          style={{alignSelf: 'flex-end'}}
          name="plus"
          color="#000"
          size={35}
          onPress={() => navigation.navigate('Transactions')}
        />

        <View style={{flexDirection: 'row'}}>
          {yearList?.map(year => {
            return (
              <Pressable
                key={year}
                onPress={() => {
                  setSelectedYear(year);
                }}>
                <View
                  key={year}
                  style={[
                    styles.groupBy,
                    {
                      backgroundColor:
                        selectedYear === year ? 'gray' : 'lightgray',
                    },
                  ]}>
                  <Text style={styles.textTitle}>{year}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{flexDirection: 'row'}}>
          <Pressable
            style={[
              styles.groupBy,
              {
                backgroundColor:
                  groupTitle === 'By Month' ? 'gray' : 'lightgray',
              },
            ]}
            onPress={getValuesByMonth}>
            <Text style={styles.textTitle}>By Month</Text>
          </Pressable>
          <Pressable
            style={[
              styles.groupBy,
              {
                backgroundColor:
                  groupTitle === 'By Year' ? 'gray' : 'lightgray',
              },
            ]}
            onPress={getValuesByYear}>
            <Text style={styles.textTitle}>By Year</Text>
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
                Alert.alert(
                  'Excluir todos',
                  'Deseja excluir todos registros?',
                  [
                    {text: 'OK', onPress: deleteAllValues},
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                      onPress: () => console.log('canceled'),
                    },
                  ],
                )
              }
            />
          </Pressable>
        </View>
        <FlatList
          //numColumns={3}
          horizontal={true}
          data={groupValues}
          renderItem={({item, index}) => (
            <CardContainer
              style={{paddingTop: 5, paddingBottom: 5, marginBottom: 15}}
              key={item.id}
              type={item.value < 0 ? 'outflow' : 'inflow'}>
              <Text>Data</Text>
              <Text style={styles.textValuesGroup}>{`${
                item.date.getMonth() + 1
              }/${item.date.getFullYear()}`}</Text>
              {/* <Text>Tipo</Text>
              <Text style={styles.textValuesGroup}>{item.assetType}</Text> */}
              <Text>Descrição</Text>
              <Text style={styles.textValuesGroup}>{item.description}</Text>
              <Text>Valor</Text>
              <Text style={styles.textValuesGroup}>
                R$ {item.value.toFixed(2)}
              </Text>
              {/* <Text style={styles.textValuesGroup}>Type {item.type}</Text> */}
            </CardContainer>
          )}
          keyExtractor={key => String(key.id)}
        />
        <Text style={styles.textTitle}>Despesas</Text>
        <OutflowChart data={groupValues} />
        <Text style={styles.textTitle}>Receitas</Text>
        <InflowChart data={groupValues} />
        <Text style={styles.textTitle}>Receitas/Despesas</Text>
        <TransactionsChart data={groupValues} />
        <FlowChart listData={groupValues} />
      </View>
    </ScrollView>
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
  textTitle: {
    color: '#0008',
    fontSize: 18,
    textAlign: 'center',
  },
});
