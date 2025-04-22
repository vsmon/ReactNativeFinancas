import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
} from 'react-native';

import Realm from '../../database/realm/schemas';
import {IValues} from '../Home';
import {IStackNavigationProps} from '../../Routes/Stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import {UpdateMode} from 'realm';
import {RouteProp, useRoute} from '@react-navigation/native';

export default function InsertTransaction({
  navigation,
  route,
}: IStackNavigationProps) {
  /* const [allValuesList, setAllValuesList] = useState<IValues[]>(); */
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date>(new Date());
  const [type, setType] = useState<string>('inflow');
  const [recurrence, setRecurrence] = useState<string>('false');
  const [value, setValue] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  /* const [isDelete, setIsDelete] = useState<boolean>(false); */
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState<boolean>(false);

  function addValue(values: IValues) {
    values.id = Realm.objects('Values').length + new Date().getTime();
    values.recurrentId = values.recurrent
      ? Realm.objects('Values').length + new Date().getTime()
      : 0;
    (values.value =
      type === 'outflow' ? parseFloat(value) * -1 : parseFloat(value)),
      Realm.write(() => {
        Realm.create('Values', values);
      });
    console.log('NEW VALUES===============', values);
    ToastAndroid.show('Transação Adicionada!', ToastAndroid.SHORT);
  }
  function addRecurrentValue(value: IValues) {
    if (value.recurrent === true) {
      const numOfYears: number =
        value.dateEnd.getFullYear() - value.date.getFullYear();
      const numOfMonths: number =
        value.dateEnd.getMonth() - value.date.getMonth();

      const totalMonths: number = numOfYears * 12 + numOfMonths;
      //console.log(totalMonths);

      const newDate = new Date(value.date);
      for (let i: number = 1; i <= totalMonths; i++) {
        const oldDate = new Date(newDate);

        newDate.setMonth(oldDate.getMonth() + 1);

        value.date = new Date(newDate);
        value.recurrentId =
          Realm.objects('Values').length + new Date().getTime();
        addValue(value);

        setRefreshing(!refreshing);
        console.log(newDate.toLocaleDateString());
      }
    }
  }
  function updateValue(values: IValues) {
    console.log('VALUE======', values);
    Realm.write(() => {
      Realm.create('Values', values, UpdateMode.Modified);
    });

    ToastAndroid.show('Transação Atualizada!', ToastAndroid.SHORT);
  }
  function handleAddValue() {
    const values: IValues = {
      id: Realm.objects('Values').length + new Date().getTime(),
      date: date,
      type: type,
      recurrent: recurrence === 'true' ? true : false,
      dateEnd: recurrenceEndDate,
      description: description.toUpperCase(),
      value: type === 'outflow' ? parseFloat(value) * -1 : parseFloat(value),
    };
    if (!route.params) {
      addValue(values);
      addRecurrentValue(values);
    } else {
      console.log('PARAMS===========', route.params);
      values.id = route.params?.values.id;
      updateValue(values);
    }
  }

  function handleEditValues() {
    //const route: RouteProp<{params: { values: IValues }}> = useRoute()
    if (route.params) {
      const {date, type, description, value, recurrent, dateEnd}: IValues =
        route.params.values;
      setDate(date);
      setType(type);
      setDescription(description);
      setValue(value.toString());
      setRecurrence(recurrent.toString());
      setRecurrenceEndDate(dateEnd);
    }
  }

  useEffect(() => {
    handleEditValues();
  }, []);

  return (
    <ScrollView style={{flex: 1}}>
      <View>
        <Text style={styles.textLabel}>Data</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Date"
          value={date.toLocaleDateString()}
          //onChangeText={value => setDate(new Date(value))}
          onPress={() => setOpenDatePicker(true)}
        />
        <DatePicker
          modal
          mode={'date'}
          open={openDatePicker}
          date={date}
          onConfirm={date => {
            setOpenDatePicker(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />
        <Text style={styles.textLabel}>Entrada/Saída</Text>
        <Picker
          style={styles.textInput}
          selectedValue={type}
          onValueChange={value => setType(value)}>
          <Picker.Item label="Entrada" value={'inflow'} />
          <Picker.Item label="Saída" value={'outflow'} />
        </Picker>
        <Text style={styles.textLabel}>Movimento Recorrente</Text>
        <Picker
          style={styles.textInput}
          selectedValue={recurrence}
          onValueChange={value => setRecurrence(value)}>
          <Picker.Item label="Sim" value={'true'} />
          <Picker.Item label="Não" value={'false'} />
        </Picker>
        <Text style={styles.textLabel}>Data final recorrência</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Data Final recorrencia"
          value={String(recurrenceEndDate.toLocaleDateString())}
          //onChangeText={value => setRecurrenceEndDate(new Date(value))}
          onPress={() => setOpenEndDatePicker(true)}
        />
        <DatePicker
          modal
          mode={'date'}
          open={openEndDatePicker}
          date={recurrenceEndDate}
          onConfirm={date => {
            setOpenEndDatePicker(false);
            setRecurrenceEndDate(date);
          }}
          onCancel={() => {
            setOpenEndDatePicker(false);
          }}
        />
        <Text style={styles.textLabel}>Descrição</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Descrição"
          value={description}
          onChangeText={value => setDescription(value)}
        />
        <Text style={styles.textLabel}>Valor</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Valor"
          value={value}
          keyboardType="numeric"
          onChangeText={value => setValue(value)}
        />
      </View>
      <View>
        <Pressable>
          <Icon
            style={{
              width: 60,
              backgroundColor: 'lightgray',
              borderRadius: 15,
              margin: 15,
              padding: 10,
            }}
            name="content-save"
            size={40}
            color={'#000'}
            onPress={() => handleAddValue()}
          />
        </Pressable>
      </View>
    </ScrollView>
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
  groupBy: {
    backgroundColor: 'lightgray',
    borderRadius: 15,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  textInput: {
    //borderRadius: 10,
    backgroundColor: 'lightgray',
    //margin: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    color: '#000',
  },
  textLabel: {
    marginLeft: 10,
    color: '#000',
    //marginBottom: 0,
  },
});
