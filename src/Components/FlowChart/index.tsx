import {useFont} from '@shopify/react-native-skia';
import {View} from 'react-native';
import {Bar, CartesianChart} from 'victory-native';
import {IValues} from '../../Pages/Home';
import {useEffect, useState} from 'react';
const inter = require('../../../assets/fonts/roboto.ttf');

interface IChartProps {
  listData: IValues[];
}

export default function FlowChart({listData}: IChartProps) {
  const [data, setData] = useState<{flow: string; value: number}[]>([]);
  function groupByFlowType(data: IValues[]) {
    let list = [];
    let sumInflow = 0;
    let sumOutflow = 0;
    data.forEach((item, index) => {
      if (item.value < 0) {
        sumOutflow += item.value;
      } else {
        sumInflow += item.value;
      }
    });
    list.push({flow: 'inflow', value: sumInflow});
    list.push({flow: 'outflow', value: sumOutflow * -1});

    /* list.push({flow: 'inflo', value: sumInflow - 3400});
    list.push({flow: 'infl', value: sumInflow - 6400}); */
    setData(list);
    return list;
  }

  //console.log('FlowChart=========', list);

  const font = useFont(inter, 12);

  useEffect(() => {
    groupByFlowType(listData);
  }, [listData]);
  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        height: 300,
      }}>
      <CartesianChart
        padding={5}
        //domain={{y: [0, 100]}}
        domainPadding={{top: 50, left: 50, right: 50}}
        data={data.map(item => ({
          ...item,
        }))}
        xKey="flow"
        xAxis={{
          font,
          formatXLabel: value => (value ? value : ''),
          tickCount: data.length - 1,
          //tickValues: [0, 1, 2],
          labelColor: 'blue',
          lineColor: 'black',
          axisSide: 'bottom',
          //labelPosition: 'outset',
          labelRotate: -0,
        }}
        yKeys={['value']}
        yAxis={[
          {
            font,
            yKeys: ['value'],
            formatYLabel: value => `R$ ${value}`,
            tickCount: 5, // Número de marcações no eixo Y
            lineColor: 'red', // Cor da linha do eixo Y
            labelColor: '#070707', // Cor dos rótulos do eixo Y
            labelOffset: 5, // Ajuste de posição dos rótulos
          },
        ]}
        frame={{lineColor: '#cc0e00', lineWidth: 3}}>
        {({points, chartBounds}) => {
          const colors = ['red', 'blue', 'green', 'orange', 'purple']; // Array de cores
          return points.value.map((value, index) => {
            const color = colors[index % colors.length]; // Seleciona a cor com base no índice
            return (
              <Bar
                key={index}
                points={[value]}
                chartBounds={chartBounds}
                //color={color}
                color={value.xValue! === 'outflow' ? 'red' : 'blue'}
                //roundedCorners={{topLeft: 10, topRight: 10}}
                labels={{position: 'top', color: '#000', font}}
                innerPadding={0.6}
                animate={{type: 'spring', duration: 2000}}
                /* animate={{type: 'timing', duration: 1000}} */
                barCount={data.length}
              />
            );
          });
        }}
      </CartesianChart>
    </View>
  );
}
