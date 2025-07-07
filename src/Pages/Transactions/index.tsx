import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, FlatList, Alert, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {IValues} from '../Home';
import Realm from '../../database/realm/schemas';
import {useIsFocused} from '@react-navigation/native';
import {IStackNavigationProps} from '../../Routes/Stack';
import CardContainer from '../../Components/CardContainer';

export default function Transactions({
  navigation,
  route,
}: IStackNavigationProps) {
  const [allValuesList, setAllValuesList] = useState<IValues[]>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  function deleteById(id: number) {
    const values: any = Realm.objects('Values').filtered(`id = ${id}`);
    Realm.write(() => {
      Realm.delete(values);
    });
    getAllValues();
    setRefreshing(!refreshing);
  }

  function getAllValues() {
    const values: any = Realm.objects('Values');
    setAllValuesList([...values]);
  }

  function getValuesByTypeTransaction() {
    if (route.params) {
      if ('type' in route.params) {
        const {type, selectedYear} = route.params;
        const values: any = Realm.objects('Values').filtered(
          `type = '${type}' AND date >= $0 AND date < $1`,
          new Date(`${selectedYear}-01-01T00:00:00.000Z`),
          new Date(`${selectedYear + 1}-01-01T00:00:00.000Z`),
        );
        setAllValuesList([...values]);
      }
    }
  }

  function deleteRecurringTransaction(recurringId: number) {
    try {
      const transactions = Realm.objects('Values').filtered(
        `recurrentId = ${recurringId}`,
      );
      Realm.write(() => {
        Realm.delete(transactions);
      });
      getAllValues();
      setRefreshing(!refreshing);
    } catch (error) {
      console.log('Error deleting recurring transaction: ', error);
    }
  }

  useEffect(() => {
    getAllValues();
    getValuesByTypeTransaction();
    setIsUpdating(false);
  }, [useIsFocused(), refreshing]);
  return (
    <View style={{flex: 1}}>
      <Icon
        style={{alignSelf: 'flex-end'}}
        name="plus"
        size={50}
        color={'#000'}
        onPress={() => navigation.navigate('InsertTransaction')}
      />
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 28,
            color: '#000',
            alignSelf: 'center',
          }}>
          {route.params && 'type' in route.params
            ? route.params.type === 'inflow'
              ? 'Receitas'
              : 'Despesas'
            : 'Receitas/Despesas'}
        </Text>
        <View style={{marginTop: 5, flex: 1}}>
          <FlatList
            data={allValuesList?.sort((a, b) => b.id - a.id)}
            renderItem={({item}) => (
              <CardContainer
                type={item.value < 0 ? 'outflow' : 'inflow'}
                onPress={() => Alert.alert(String(item.id))}
                onLongPress={() => setIsUpdating(!isUpdating)}>
                <Text>ID:{item.id}</Text>
                <Text>RecurrentID:{item.recurrentId}</Text>
                <Text style={styles.textTitle}>Data</Text>
                <Text style={styles.textValues}>
                  {item.date.toLocaleDateString()}
                </Text>
                <Text style={styles.textTitle}>Descrição</Text>
                <Text style={styles.textValues}>{item.description}</Text>
                <Text style={styles.textTitle}>Tipo</Text>
                <Text style={styles.textValues}>{item.assetType}</Text>
                <Text style={styles.textTitle}>Valor</Text>
                <Text style={styles.textValues}>R$ {item.value}</Text>

                {isUpdating ? (
                  <View style={{marginTop: 10, flexDirection: 'row'}}>
                    <Icon
                      name="delete"
                      size={35}
                      color={'black'}
                      onPress={() => {
                        Alert.alert(
                          'Delete transaction',
                          'Would you like deleting recurring transactions?',
                          [
                            {
                              text: 'YES',
                              onPress: () => {
                                deleteRecurringTransaction(item.recurrentId);
                              },
                            },
                            {
                              text: 'NO',
                              onPress: () => deleteById(item.id),
                            },
                            {
                              text: 'Cancel',
                            },
                          ],
                        );
                      }}
                    />
                    <Icon
                      name="application-edit"
                      size={35}
                      color={'black'}
                      onPress={() =>
                        navigation.navigate('InsertTransaction', {
                          values: {
                            ...item,
                            serializedDate: item.date.toISOString(),
                          },
                          edit: true,
                        })
                      }
                    />
                  </View>
                ) : null}
              </CardContainer>
            )}
            keyExtractor={key => String(key.id)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textValues: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#0008',
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
  groupBy: {
    backgroundColor: 'lightgray',
    borderRadius: 15,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  textInput: {
    borderRadius: 10,
    backgroundColor: 'lightgray',
    margin: 10,
  },
});
