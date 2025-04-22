import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

export default function Settings() {
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('');

  return (
    <View>
      <Text style={{textAlign: 'center', fontSize: 18, color: '#000'}}>
        Settings
      </Text>
      <Text style={styles.textLabel}>Bitcoin address</Text>
      <TextInput
        style={styles.input}
        placeholder="Bitcoin addresses..."
        //placeholderTextColor="#000"
        value={bitcoinAddress}
        onChangeText={text => setBitcoinAddress(text)}
        autoCapitalize="none"
      />
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
