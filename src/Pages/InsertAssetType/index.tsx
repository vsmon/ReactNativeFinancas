import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import Realm from '../../database/realm/schemas';
import {IAssetType, IValues} from '../Home';
import toastMessage from '../../Utils/ToastMessage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import realm from '../../database/realm/schemas';
import CardContainer from '../../Components/CardContainer';
import {AnyRealmObject} from '@realm/react/dist/helpers';

export default function InsertAssetType() {
  const [labelAsset, setLabelAsset] = useState<string>('');
  const [valueAsset, setValueAsset] = useState<string>('');
  const [allAssets, setAllAssets] = useState<IAssetType[]>();
  const [deleting, setDeleting] = useState<boolean>(false);

  function getAllAssets() {
    const assetList: IAssetType[] | any = realm.objects('AssetType');
    setAllAssets([...assetList]);
  }

  function deleteAssetById(id: number) {
    try {
      const assets: IAssetType | any = Realm.objects('AssetType').filtered(
        `id = ${id}`,
      );

      const values: IValues[] | any = realm
        .objects('Values')
        .filtered(`assetType = "${assets[0].value}"`);

      if (values.length === 0) {
        Realm.write(() => {
          Realm.delete(assets);
        });
        getAllAssets();
      } else {
        toastMessage('Esse tipo de ativo contém uma transação!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function saveDB(values: IAssetType) {
    console.log('NEW VALUES===============', values);
    try {
      Realm.write(() => {
        Realm.create('AssetType', values);
      });
      toastMessage('Saved!');
    } catch (error) {
      console.log(error);
      toastMessage(`Error when saving data! ${error}`);
    }
  }

  function handleSave() {
    const values: IAssetType = {
      id: Realm.objects('AssetType').length + new Date().getTime(),
      label: labelAsset,
      value: valueAsset,
    };
    saveDB(values);
    getAllAssets();
  }

  useEffect(() => {
    getAllAssets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center', fontSize: 18, color: '#000'}}>
        Settings
      </Text>
      <Text style={styles.textLabel}>Nome</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Nome..."
        placeholderTextColor={'#8d8d8d'}
        value={valueAsset}
        onChangeText={text => setValueAsset(text)}
        autoCapitalize="none"
      />
      <Text style={styles.textLabel}>Descrição</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Descrição..."
        placeholderTextColor={'#8d8d8d'}
        value={labelAsset}
        onChangeText={text => setLabelAsset(text)}
        autoCapitalize="none"
      />
      <Icon
        style={styles.buttonSave}
        name="content-save"
        size={40}
        color={'#000'}
        onPress={() => handleSave()}
      />
      <View style={{flex: 1}}>
        <FlatList
          data={allAssets}
          renderItem={({item, index}) => (
            <View
              style={{
                flex: 1,
              }}>
              <CardContainer
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                color="#a0a0a0"
                onLongPress={() => setDeleting(!deleting)}
                onPress={() => console.log('clicked')}>
                <Text
                  style={{
                    fontSize: 18,
                    flexGrow: 1,
                    textAlign: 'center',
                  }}>
                  {item.label}
                </Text>
                {deleting ? (
                  <Icon
                    name="delete"
                    size={28}
                    color={'red'}
                    onPress={() => deleteAssetById(item.id)}
                  />
                ) : undefined}
              </CardContainer>
            </View>
          )}
          keyExtractor={key => key.value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
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
