import Realm, {Configuration, ObjectSchema} from 'realm';

const Values: ObjectSchema = {
  name: 'Values',
  properties: {
    id: 'int',
    date: 'date',
    type: 'string',
    description: 'string',
    value: 'double',
    recurrent: 'bool',
    dateEnd: 'date',
    recurrentId: 'int',
    assetType: 'string',
    assetLabel: 'string',
  },
  primaryKey: 'id',
};

const BitcoinData: ObjectSchema = {
  name: 'BitcoinData',
  properties: {
    id: 'int',
    address: 'string',
    price: 'double',
    balance: 'double',
    profit: 'double',
    currency: 'string',
  },
  primaryKey: 'id',
};

const AssetType: ObjectSchema = {
  name: 'AssetType',
  properties: {
    id: 'int',
    label: 'string',
    value: 'string',
  },
};

// Função de migração para lidar com o novo campo
const migration = (oldRealm: Realm, newRealm: Realm) => {
  const oldVersion = oldRealm.schemaVersion;
  console.log('schemaVersion==============', oldVersion);

  if (oldVersion < 1) {
    const newObjects = newRealm.objects('Values');
    for (const obj of newObjects) {
      if (!('assetLabel' in obj)) {
        (obj as any).assetLabel = ''; // Inicializa o novo campo "Label" com um valor padrão
      }
    }
  }
};

const realm = new Realm({
  schema: [Values, BitcoinData, AssetType],
  schemaVersion: 2, // Atualize a versão do esquema
  onMigration: migration,
});

//Initialize database with preloading
realm.write(() => {
  if (realm.objects('AssetType').length === 0) {
    const records = [
      {id: 1, label: 'Aluguel', value: 'rental'},
      {id: 2, label: 'Condomínio', value: 'condofee'},
      {id: 3, label: 'Energia', value: 'eletricity'},
      {id: 4, label: 'Água', value: 'water'},
      {id: 5, label: 'Investimentos', value: 'investments'},
      {id: 6, label: 'Cartão de Crédito', value: 'creditcard'},
      {id: 7, label: 'Internet', value: 'internet'},
      {id: 8, label: 'Bitcoin', value: 'bitcoin'},
      {id: 9, label: 'Dolar', value: 'dollar'},
    ];
    records.forEach(record => {
      realm.create('AssetType', record);
    });
  }
});

export default realm;
