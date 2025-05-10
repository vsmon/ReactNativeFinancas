import React from 'react';
import {VictoryBar, VictoryChart, VictoryTheme} from 'victory-native';

export default function MyVictoryChart({
  listData,
}: {
  listData: {flow: string; value: number}[];
}) {
  return (
    <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
      <VictoryBar
        data={listData}
        x="flow" // Propriedade para o eixo X
        y="value" // Propriedade para o eixo Y
        labels={({datum}) => `R$ ${datum.value.toFixed(2)}`} // Texto do label
        style={{
          data: {
            fill: ({datum}) => (datum.flow === 'inflow' ? 'blue' : 'red'), // Cor da barra com base no tipo
          },
          labels: {
            fill: '#000', // Cor do texto do label
            fontSize: 12, // Tamanho da fonte
            fontWeight: 'bold', // Peso da fonte
          },
        }}
      />
    </VictoryChart>
  );
}
