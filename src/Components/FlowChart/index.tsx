import {useFont} from '@shopify/react-native-skia';
import {View} from 'react-native';
import {Bar, CartesianChart} from 'victory-native';
import {IValues} from '../../Pages/Home';
import {useEffect, useState} from 'react';
import DefaultChart from '../DefaultChart';
const inter = require('../../../assets/fonts/roboto.ttf');

interface IChartProps {
  listData: IValues[];
}

export default function FlowChart({listData}: IChartProps) {
  const font = useFont(inter, 12);

  function groupByFlowType(data: IValues[]) {
    let list: {type: string; value: number}[] = [];

    const allOutflowData: IValues[] = data.filter(
      item => item.type === 'outflow',
    );
    const totalOutflow: number = allOutflowData.reduce(
      (sum, curr) => (sum += curr.value),
      0,
    );

    const allInflowData: IValues[] = data.filter(
      item => item.type === 'inflow',
    );
    const totalInflow: number = allInflowData.reduce(
      (sum, curr) => (sum += curr.value),
      0,
    );

    list.push(
      {type: 'Despesas', value: totalOutflow},
      {type: 'Receitas', value: totalInflow},
    );

    return list;
  }

  const data = groupByFlowType(listData);
  /* return <DefaultChart data={result} xKey={'type'} yKeys={'value'} />; */
  return (
    <View
      style={{
        paddingTop: 0,
        paddingBottom: 50,
        width: '100%',
        height: 300,
      }}>
      <CartesianChart
        //viewport={{y: [0, 100]}}
        padding={{top: 5, bottom: 50, left: 5, right: 5}}
        //domain={{y: [0, 100]}}
        domainPadding={{left: 50, right: 50, top: 50}}
        data={data.map(item => ({
          ...item,
          /* date: item.date.toISOString(), */
        }))}
        xKey="type"
        xAxis={{
          font,
          formatXLabel: value => (value ? value : ''),
          labelColor: 'black',
          lineWidth: 0,
          //lineColor: 'black',
          axisSide: 'bottom',
          tickCount: data.length,
          labelRotate: data.length > 5 ? -90 : 0,
          labelPosition: 'outset',
          //labelOffset: -5,
        }}
        yKeys={['value']}
        yAxis={[
          {
            font,
            yKeys: ['value'],
            formatYLabel: value => `R$${value.toFixed(2)}`,
            tickCount: 5, // Número de marcações no eixo Y
            //lineColor: 'red', // Cor da linha do eixo Y
            labelColor: '#070707', // Cor dos rótulos do eixo Y
            labelOffset: 5, // Ajuste de posição dos rótulos
          },
        ]}
        /* frame={{lineColor: '#00cc11', lineWidth: 3}} */
      >
        {({points, chartBounds}) => {
          const colors = ['red', 'blue', 'green', 'orange', 'purple']; // Array de cores
          return points.value.map((value, index) => {
            const color = colors[index % colors.length]; // Seleciona a cor com base no índice
            return (
              <Bar
                key={index}
                points={[value]}
                chartBounds={chartBounds}
                color={color}
                /* value.yValue! < 0 ? 'red' : 'blue' */
                //roundedCorners={{topLeft: 10, topRight: 10}}
                labels={{position: 'top', color: '#000', font}}
                //innerPadding={0.4}
                animate={{type: 'spring', duration: 1000}}
                /* animate={{type: 'timing', duration: 1000}} */
                barCount={data.length}
                //barWidth={10}
              />
            );
          });
        }}
      </CartesianChart>
    </View>
  );
}
