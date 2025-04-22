import Realm from 'realm';

const Values = {
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
  },
  primaryKey: 'id',
};

const BitcoinData = {
  name: 'BitcoinData',
  properties: {
    address: 'string',
    price: 'double',
    balance: 'double',
    profit: 'double',
    currency: 'string',
  },
};

const realm = new Realm({
  schema: [Values, BitcoinData],
});

export default realm;
