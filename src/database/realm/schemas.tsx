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
  },
  primaryKey: 'id',
};

const realm = new Realm({
  schema: [Values],
});

export default realm;
