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

  useEffect(() => {
    getAllValues();
    getValuesByTypeTransaction();
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
        <View style={{marginTop: 5}}>
          <FlatList
            data={allValuesList?.sort((a, b) => b.id - a.id)}
            renderItem={({item}) => (
              <Pressable
                onPress={() => Alert.alert(String(item.id))}
                onLongPress={() => setIsUpdating(!isUpdating)}>
                <CardContainer type={item.value < 0 ? 'outflow' : 'inflow'}>
                  <Text>{item.id}</Text>
                  <Text style={styles.textTitle}>Data</Text>
                  <Text style={styles.textValues}>
                    {item.date.toLocaleDateString()}
                  </Text>
                  <Text style={styles.textTitle}>Descrição</Text>
                  <Text style={styles.textValues}>{item.description}</Text>
                  <Text style={styles.textTitle}>Valor</Text>
                  <Text style={styles.textValues}>R$ {item.value}</Text>

                  {isUpdating ? (
                    <View style={{marginTop: 10, flexDirection: 'row'}}>
                      <Icon
                        name="delete"
                        size={35}
                        color={'red'}
                        onPress={() => deleteById(item.id)}
                      />
                      <Icon
                        name="application-edit"
                        size={35}
                        color={'red'}
                        onPress={() =>
                          navigation.navigate('InsertTransaction', {
                            values: item,
                            edit: true,
                          })
                        }
                      />
                    </View>
                  ) : null}
                </CardContainer>
              </Pressable>
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
