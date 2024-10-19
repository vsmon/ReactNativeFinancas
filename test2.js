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

const listSoma = [];

item.forEach(it => {
  const key = it.date + it.descricao;
  const existingItem = listSoma.find(
    item => item.date + item.descricao === key,
  );

  const index = listSoma.findIndex(item => item.date + item.descricao === key);
  listSoma[index].valor += item.id;
  console.log(listSoma[index]);

  if (existingItem) {
    existingItem.valor += it.valor; // Soma os valores
  } else {
    listSoma.push({...it}); // Adiciona um novo item
  }
});

const date1 = new Date();
const date2 = new Date('2024-11-28T18:30:44.730Z');

const diff = Math.abs(date2 - date1);

console.log(new Date(date2) + 10);
