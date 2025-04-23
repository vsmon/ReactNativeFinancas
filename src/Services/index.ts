const respBlockCypher = [
  {error: 'HTTP error calling /v1/btc/main/addrs/hfadf: 404'},
  {
    address: 'bc1qgwkmvh2xawq58xjtfu8rpfy6a8zdw5fe4av9y3',
    total_received: 25030381,
    total_sent: 11596,
    balance: 25018785,
    unconfirmed_balance: 0,
    final_balance: 25018785,
    n_tx: 2,
    unconfirmed_n_tx: 0,
    final_n_tx: 2,
    txrefs: [
      {
        tx_hash:
          '1e6d49750898b7f243c4a12ff47b083ac7b1443b728720b8f12bd21e00b22166',
        block_height: 864607,
        tx_input_n: 28,
        tx_output_n: -1,
        value: 11596,
        ref_balance: 25018785,
        confirmations: 28903,
        confirmed: '2024-10-07T14:59:44Z',
        double_spend: false,
      },
      {
        tx_hash:
          '1e6d49750898b7f243c4a12ff47b083ac7b1443b728720b8f12bd21e00b22166',
        block_height: 864607,
        tx_input_n: -1,
        tx_output_n: 0,
        value: 25018785,
        ref_balance: 25030381,
        spent: false,
        confirmations: 28903,
        confirmed: '2024-10-07T14:59:44Z',
        double_spend: false,
      },
      {
        tx_hash:
          'dfebce4947c2b5c1ae52a806a937cb6e72354e6aa387753dcd9e84fab4240395',
        block_height: 864604,
        tx_input_n: -1,
        tx_output_n: 0,
        value: 11596,
        ref_balance: 11596,
        spent: true,
        spent_by:
          '1e6d49750898b7f243c4a12ff47b083ac7b1443b728720b8f12bd21e00b22166',
        confirmations: 28906,
        confirmed: '2024-10-07T14:41:30Z',
        double_spend: false,
      },
    ],
    tx_url: 'https://api.blockcypher.com/v1/btc/main/txs/',
  },
];
async function getBitcoinPrice(currency: string = 'USD'): Promise<number> {
  const URL = `https://api.coinbase.com/v2/prices/BTC-${currency}/buy`;

  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Error to get bitcoin price!');
    }

    const {
      data: {amount},
    }: {data: {amount: number}} = await response.json();

    return await Promise.resolve(amount);
  } catch (error) {
    console.log('Ocorreu um erro ao obter os dados da API', error);
    return 0;
  }
}

async function getBitcoinAmountBlockChain(address: string): Promise<number> {
  const URL = `https://blockchain.info/rawaddr/${address}`;
  try {
    const response = await fetch(URL);
    if (response.status !== 200) {
      throw new Error('Error to get wallet values!');
    }
    const data = await response.json();
    const balanceSatoshis = data.final_balance;
    const balanceBitcoin = balanceSatoshis / 100000000; // 1 Bitcoin = 100,000,000 Satoshis
    return balanceBitcoin;
  } catch (error) {
    console.log('Ocorreu um erro ao obter os dados da API', error);
    return 0;
  }
}

async function getBitcoinAmountBlockCypher(address: string): Promise<number> {
  const URL = `https://api.blockcypher.com/v1/btc/main/addrs/${address}`;
  console.log('URL=============', URL);
  try {
    const response = await fetch(URL);

    const data = await response.json();

    let sumBalance = 0;

    if (Array.isArray(data)) {
      sumBalance = data.reduce(
        (accum: any, curr: any) => (accum += curr.balance ? curr.balance : 0),
        0,
      );
    } else {
      sumBalance = data.balance;
    }

    const balanceBitcoin = sumBalance / 100000000; // 1 Bitcoin = 100,000,000 Satoshis;;
    return balanceBitcoin;
  } catch (error) {
    console.log('Ocorreu um erro ao obter os dados da API', error);
    return 0;
  }
}

async function getBalances(addresses: string[]): Promise<number[]> {
  const balances: number[] = await Promise.all(
    addresses.map(address => getBitcoinAmountBlockChain(address)),
  );
  return balances;
}

export {
  getBitcoinPrice,
  getBitcoinAmountBlockChain,
  getBitcoinAmountBlockCypher,
  getBalances,
};
