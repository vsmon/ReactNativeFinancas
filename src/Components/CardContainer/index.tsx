import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ICardContainer {
  children: React.ReactNode;
  type?: 'inflow' | 'outflow' | 'balance' | string;
}

export default function CardContainer({
  children,
  type,
  ...rest
}: ICardContainer) {
  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor:
            type === 'outflow'
              ? '#fd4d4d'
              : type === 'inflow'
              ? '#377dfd'
              : '#018011',
        },
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    margin: 5,
    marginBottom: 5,
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  textCard: {fontSize: 38},
});
