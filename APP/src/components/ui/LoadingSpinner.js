import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const LoadingSpinner = ({ size = 'large', color, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size === 'small' ? 'small' : 'large'}
        color={color || COLORS.brandOrange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default LoadingSpinner;
