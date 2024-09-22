const item = [
  {
    id: 1,
    date: '15/09/2024',
    descricao: 'Apto',
    valor: 620,
  },
  {
    id: 2,
    date: '16/09/2024',
    descricao: 'Condominio',
    valor: 335,
  },
  {
    id: 3,
    date: '17/09/2024',
    descricao: 'Internet',
    valor: 100,
  },
  {
    id: 4,
    date: '17/09/2024',
    descricao: 'Internet',
    valor: 100,
  },
];

//console.log(item.reduce((prev, next) => prev + next.valor, 0));

const soma = {};
const listSoma = [];

item.forEach(it => {
  const key = it.date + it.descricao;

  if (!soma[key]) {
    listSoma[key] = it;
  }
  listSoma[key].valor += it.valor;
});

//console.log(listSoma);

const sumObj = {
  '2024/7/Test': {
    date: '2024-07-10T00:00:00.000Z',
    dateEnd: '2024-09-15T17:22:20.888Z',
    description: 'Test',
    id: 1,
    recurrent: true,
    type: 'outflow',
    value: 500,
  },
  '2024/8/Test': {
    date: '2024-08-12T00:00:00.000Z',
    dateEnd: '2024-09-15T19:07:40.786Z',
    description: 'Test',
    id: 6,
    recurrent: true,
    type: 'outflow',
    value: 100,
  },
  '2024/8/Test1': {
    date: '2024-08-12T00:00:00.000Z',
    dateEnd: '2024-09-15T19:08:00.520Z',
    description: 'Test1',
    id: 7,
    recurrent: true,
    type: 'outflow',
    value: 200,
  },
  '2024/9/Test1': {
    date: '2024-09-12T00:00:00.000Z',
    dateEnd: '2024-09-15T20:01:55.688Z',
    description: 'Test1',
    id: 9,
    recurrent: true,
    type: 'outflow',
    value: 100,
  },
};

const sumArray = [
  {
    date: '2024-07-10T00:00:00.000Z',
    dateEnd: '2024-09-15T17:22:20.888Z',
    description: 'Test',
    id: 1,
    recurrent: true,
    type: 'outflow',
    value: 500,
  },
  {
    date: '2024-08-12T00:00:00.000Z',
    dateEnd: '2024-09-15T19:07:40.786Z',
    description: 'Test',
    id: 6,
    recurrent: true,
    type: 'outflow',
    value: 100,
  },
  {
    date: '2024-08-12T00:00:00.000Z',
    dateEnd: '2024-09-15T19:08:00.520Z',
    description: 'Test1',
    id: 7,
    recurrent: true,
    type: 'outflow',
    value: 200,
  },
  {
    date: '2024-09-12T00:00:00.000Z',
    dateEnd: '2024-09-15T20:01:55.688Z',
    description: 'Test1',
    id: 9,
    recurrent: true,
    type: 'outflow',
    value: 100,
  },
];

for (const obj in sumObj) {
  console.log(obj);
  //console.log(sumObj[key]);
}
