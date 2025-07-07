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
import {IAssetType, IValues} from '../Home';
import {IStackNavigationProps} from '../../Routes/Stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import {AnyRealmObject, UpdateMode} from 'realm';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import toastMessage from '../../Utils/ToastMessage';

export default function InsertTransaction({
  navigation,
  route,
}: IStackNavigationProps) {
  /* const [allValuesList, setAllValuesList] = useState<IValues[]>(); */
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [recurrentId, setRecurrentId] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date>(new Date());
  const [type, setType] = useState<string>('inflow');
  const [recurrence, setRecurrence] = useState<string>('false');
  const [assetType, setAssetType] = useState<string>('n/a');
  const [defaultAssetType, setDefaultAssetType] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  /* const [isDelete, setIsDelete] = useState<boolean>(false); */
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState<boolean>(false);
  const [allAssetsList, setAllAssetsList] = useState<IAssetType[]>();
  const [transactionToEdit, setTransactionToEdit] = useState<IValues>();

  const valuesParams: IValues | undefined =
    route.params && 'values' in route.params ? route.params.values : undefined;
  const editParams: boolean | undefined =
    route.params && 'edit' in route.params ? route.params.edit : undefined;

  function addValue(values: IValues) {
    Realm.write(() => {
      Realm.create('Values', values);
    });

    console.log('NEW VALUES===============', values);
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

        value.id = Realm.objects('Values').length + new Date().getTime();
        //value.recurrentId = value.id;

        addValue(value);

        setRefreshing(!refreshing);
        console.log(newDate.toLocaleDateString());
      }
    }
  }

  function updateRecurrentTransaction() {
    const values: IValues = {
      id: id,
      date: date,
      type: type,
      recurrent: recurrence === 'true' ? true : false,
      dateEnd: recurrenceEndDate,
      description: description.toUpperCase(),
      value: parseFloat(value),
      assetType: assetType,
      assetLabel: '',
      recurrentId: recurrentId,
    };
    const transactions: IValues[] | any = Realm.objects<IValues>(
      'Values',
    ).filtered(`recurrentId = ${values.recurrentId}`);

    transactions.map((transaction: IValues) => {
      values.id = transaction.id;
      values.recurrentId = transaction.recurrentId;
      values.date = transaction.date;
      values.dateEnd = transaction.dateEnd;
      Realm.write(() => {
        Realm.create('Values', values, UpdateMode.Modified);
      });
    });
  }

  function updateValue(values: IValues) {
    Realm.write(() => {
      Realm.create('Values', values, UpdateMode.Modified);
    });

    toastMessage('Transação Atualizada!');
  }

  function handleUpdate(values: IValues) {
    values.id = id;
    values.recurrentId = recurrentId;
    if (values.recurrent === true) {
      Alert.alert(
        'Update transaction',
        'Would you like updating recurring transactions?',
        [
          {
            text: 'YES',
            onPress: () => {
              updateRecurrentTransaction();
              toastMessage('Todas Transações Recorrentes Atualizada!');
            },
          },
          {
            text: 'ONLY THIS',
            onPress: () => {
              updateValue(values);
              toastMessage('Transação Atualizada!');
            },
          },
          {
            text: 'Cancel',
          },
        ],
      );
    } else {
      updateValue(values);
      toastMessage('Transação Atualizada!');
    }
  }
  function handleSave() {
    const id = Realm.objects('Values').length + new Date().getTime();
    const values: IValues = {
      id: id,
      date: date,
      type: type,
      recurrent: recurrence === 'true' ? true : false,
      dateEnd: recurrenceEndDate,
      description: description.toUpperCase(),
      value: type === 'outflow' ? parseFloat(value) * -1 : parseFloat(value),
      assetType: assetType,
      assetLabel: '',
      recurrentId: recurrence ? id : 0,
    };

    if (editParams === false || editParams === undefined) {
      addValue(values);
      recurrence ? addRecurrentValue(values) : null;
      toastMessage('Transação Adicionada!');
    } else {
      handleUpdate(values);
    }
  }

  function handleLoadEditing() {
    if (editParams === true && valuesParams) {
      const {
        id,
        recurrentId,
        serializedDate,
        type,
        recurrent,
        dateEnd,
        assetType,
        description,
        value,
      }: IValues = valuesParams;
      setId(id);
      setRecurrentId(recurrentId);
      setDate(new Date(serializedDate!));
      setType(type);
      setRecurrence(recurrent.toString());
      setRecurrenceEndDate(dateEnd);
      setDefaultAssetType(assetType);
      setAssetType(assetType);
      setDescription(description);
      setValue(value.toString());
      //console.log('assetTypeEditing=========', assetType);
    }
  }

  function loadAssets() {
    const assets: IAssetType[] | any = Realm.objects('AssetType');

    //setAssetType(assets[0].value);

    setAllAssetsList([...assets]);
  }

  useEffect(() => {
    handleLoadEditing();
    loadAssets();
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
        <View style={[styles.textInput, styles.pickerContainer]}>
          <Picker
            style={styles.textInput}
            selectedValue={type}
            onValueChange={value => setType(value)}>
            <Picker.Item
              style={styles.pickerItemText}
              label="Entrada"
              value={'inflow'}
            />
            <Picker.Item
              style={styles.pickerItemText}
              label="Saída"
              value={'outflow'}
            />
          </Picker>
        </View>
        <Text style={styles.textLabel}>Movimento Recorrente</Text>
        <View style={[styles.textInput, styles.pickerContainer]}>
          <Picker
            style={styles.textInput}
            selectedValue={recurrence}
            onValueChange={value => setRecurrence(value)}>
            <Picker.Item
              style={styles.pickerItemText}
              label="Sim"
              value={'true'}
            />
            <Picker.Item
              style={styles.pickerItemText}
              label="Não"
              value={'false'}
            />
          </Picker>
        </View>
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
        <Text style={styles.textLabel}>Tipo do Ativo/Passivo</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={[styles.textInput, {marginBottom: 0}]}
            selectedValue={assetType}
            onValueChange={value => setAssetType(value)}>
            {allAssetsList?.map((asset, index) => {
              return (
                <Picker.Item
                  style={styles.pickerItemText}
                  key={index}
                  value={asset.value}
                  label={asset.label}
                />
              );
            })}
          </Picker>
          <Icon
            style={{
              fontWeight: 'bold',
              borderRadius: 5,
              backgroundColor: '#8d8d8d',
              marginRight: 5,
            }}
            name="plus"
            size={43}
            color={'#000'}
            onPress={() => navigation.navigate('InsertAssetType')}
          />
        </View>

        <Text style={styles.textLabel}>Descrição</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Descrição..."
          placeholderTextColor={'#8d8d8d'}
          value={description}
          onChangeText={value => setDescription(value)}
        />
        <Text style={styles.textLabel}>Valor</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Valor..."
          placeholderTextColor={'#8d8d8d'}
          value={value}
          keyboardType="numeric"
          onChangeText={value => setValue(value)}
        />
      </View>
      <View style={styles.buttonSave}>
        <Pressable>
          <Icon
            name="content-save"
            size={40}
            color={'#000'}
            onPress={() => handleSave()}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    color: '#000',
    fontFamily: 'Roboto',
  },
  textLabel: {
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
    color: '#000',
    fontFamily: 'Roboto',
  },
  pickerItemText: {
    color: 'black',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  buttonSave: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    margin: 10,
    padding: 5,
  },
});
