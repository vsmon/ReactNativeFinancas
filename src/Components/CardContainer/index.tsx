import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

interface ICardContainer {
  children: React.ReactNode;
  type?: 'inflow' | 'outflow' | 'balance' | string;
  onPress?: () => void; // Optional onPress function
  onLongPress?: () => void; // Optional onLongPress function
}

export default function CardContainer({
  onPress,
  onLongPress,
  children,
  type,
  ...rest
}: ICardContainer) {
  return (
    <Pressable onLongPress={onLongPress} onPress={onPress} {...rest}>
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
    </Pressable>
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
  textCard: {fontSize: 38, color: '#0008'},
});
