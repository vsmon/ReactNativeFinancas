import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import Realm from '../../database/realm/schemas';
import {IBitcoinData, IValues} from '../Home';
import toastMessage from '../../Utils/ToastMessage';

export default function Settings() {
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('');
  const [bitcoinCurrency, setBitcoinCurrency] = useState<string>('USD');

  function saveDB(values: IBitcoinData) {
    console.log('NEW VALUES===============', values);
    try {
      Realm.write(() => {
        Realm.create('BitcoinData', values);
      });
      toastMessage('Saved!');
    } catch (error) {
      console.log(error);
      toastMessage(`Error when saving data! ${error}`);
    }
  }

  function handleSave() {
    const values: IBitcoinData = {
      id: Realm.objects('BitcoinData').length + new Date().getTime(),
      address: bitcoinAddress,
      price: 0,
      balance: 0,
      profit: 0,
      currency: bitcoinCurrency,
    };
    saveDB(values);
  }

  function loadSettings() {
    const data: IBitcoinData[] | any = Realm.objects('BitcoinData');
    if (data.length > 0) {
      setBitcoinAddress(data[data.length - 1].address);
      setBitcoinCurrency(data[data.length - 1].currency);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View>
      <Text style={{textAlign: 'center', fontSize: 18, color: '#000'}}>
        Settings
      </Text>
      <Text style={styles.textLabel}>Bitcoin address</Text>
      <TextInput
        style={styles.input}
        placeholder="Bitcoin addresses..."
        value={bitcoinAddress}
        onChangeText={text => setBitcoinAddress(text)}
        autoCapitalize="none"
      />
      <Text style={styles.textLabel}>Currency</Text>
      <TextInput
        style={styles.input}
        placeholder="Currency..."
        value={bitcoinCurrency}
        onChangeText={text => setBitcoinCurrency(text)}
        autoCapitalize="none"
      />
      <Pressable onPress={() => handleSave()}>
        <Text>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    margin: 10,
    borderRadius: 5,
  },
  textLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
});
