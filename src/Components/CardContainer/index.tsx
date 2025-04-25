import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface ICardContainer {
  children: React.ReactNode;
  type?: 'inflow' | 'outflow' | 'balance' | string;
  color?: '#a0a0a0';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void; // Optional onPress function
  onLongPress?: () => void; // Optional onLongPress function
}

export default function CardContainer({
  onPress,
  onLongPress,
  children,
  type,
  color,
  style,
  ...rest
}: ICardContainer) {
  return (
    <Pressable onLongPress={onLongPress} onPress={onPress} {...rest}>
      <View
        style={[
          styles.cardContainer,
          style,
          {
            backgroundColor: !color
              ? type === 'outflow'
                ? '#fd4d4d'
                : type === 'inflow'
                ? '#377dfd'
                : '#018011'
              : color,
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
