import {useFont} from '@shopify/react-native-skia';
import {View} from 'react-native';
import {Bar, CartesianChart} from 'victory-native';
import {IValues} from '../../Pages/Home';
import DefaultChart from '../DefaultChart';
const inter = require('../../../assets/fonts/roboto.ttf');

interface IChartProps {
  data: IValues[];
}

export default function InflowChart({data}: IChartProps) {
  const font = useFont(inter, 12);

  function groupByAssetType(data: IValues[]) {
    const allInflowData: IValues[] = data.filter(
      item => item.type === 'inflow',
    );
    const totalInflow: number = allInflowData.reduce(
      (sum, curr) => (sum += curr.value),
      0,
    );

    const groupedList: IValues[] = [];

    allInflowData.map((asset, index) => {
      const findedIndex: number = groupedList.findIndex(
        item => item.assetType === asset.assetType,
      );

      if (findedIndex === -1) {
        groupedList.push({...asset});
      } else {
        groupedList[findedIndex].value += asset.value;
      }
    });

    //console.log('totais===============', totalInflow, totalOutflow);

    return groupedList.map(item => ({
      ...item,
      percentage: Math.round((item.value / totalInflow) * 100 * 100) / 100,
    }));
  }
  const result = groupByAssetType(data);
  //console.log('TransactionChart===========', result);
  return <DefaultChart data={result} xKey={'assetType'} yKeys={'percentage'} />;
  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        height: 300,
      }}>
      <CartesianChart
        //viewport={{y: [0, 100]}}
        padding={{top: 5, bottom: 50, left: 5, right: 5}}
        //domain={{y: [0, 100]}}
        domainPadding={{left: 50, right: 50, top: 50}}
        data={result.map(item => ({
          ...item,
          /* date: item.date.toISOString(), */
        }))}
        xKey="assetType"
        xAxis={{
          font,
          formatXLabel: value => (value ? value : ''),
          labelColor: 'blue',
          lineColor: 'black',
          axisSide: 'bottom',
          tickCount: result.length,
          labelRotate: result.length > 5 ? -90 : 0,
          //labelPosition: 'outset',
          //labelOffset: -5,
        }}
        yKeys={['percentage']}
        yAxis={[
          {
            font,
            yKeys: ['percentage'],
            formatYLabel: value => `${value} %`,
            tickCount: 10, // Número de marcações no eixo Y
            lineColor: 'red', // Cor da linha do eixo Y
            labelColor: '#070707', // Cor dos rótulos do eixo Y
            labelOffset: 5, // Ajuste de posição dos rótulos
          },
        ]}
        frame={{lineColor: '#00cc11', lineWidth: 3}}>
        {({points, chartBounds}) => {
          const colors = ['red', 'blue', 'green', 'orange', 'purple']; // Array de cores
          return points.percentage.map((value, index) => {
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
                animate={{type: 'spring', duration: 2000}}
                /* animate={{type: 'timing', duration: 1000}} */
                barCount={result.length}
                //barWidth={10}
              />
            );
          });
        }}
      </CartesianChart>
    </View>
  );
}
