import {useFont} from '@shopify/react-native-skia';
import {View} from 'react-native';
import {Bar, CartesianChart} from 'victory-native';
import {IValues} from '../../Pages/Home';
const inter = require('../../../assets/fonts/roboto.ttf');

interface IChartProps {
  data: IValues[] | {type: string; value: number}[];
  xKey: any;
  yKeys: any;
}

export default function DefaultChart({data, xKey, yKeys}: IChartProps) {
  const font = useFont(inter, 12);
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
        xKey={xKey}
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
        yKeys={[yKeys]}
        yAxis={[
          {
            font,
            yKeys: [yKeys],
            formatYLabel: value => `${value} %`,
            tickCount: 5, // Número de marcações no eixo Y
            //lineColor: 'red', // Cor da linha do eixo Y
            labelColor: '#070707', // Cor dos rótulos do eixo Y
            labelOffset: 5, // Ajuste de posição dos rótulos
          },
        ]}
        /* frame={{lineColor: '#00cc11', lineWidth: 3}} */
      >
        {({points, chartBounds}) => {
          const colors = [
            'green',
            'orange',
            'purple',
            'red',
            'blue',
            'yellow',
            'pink',
            'cyan',
            'brown',
            'gray',
          ]; // Array de cores
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
