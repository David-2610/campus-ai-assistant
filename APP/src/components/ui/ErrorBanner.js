import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const ErrorBanner = ({ message, style }) => {
  if (!message) return null;
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const SuccessBanner = ({ message, style }) => {
  if (!message) return null;
  return (
    <View style={[styles.successContainer, style]}>
      <Text style={styles.successText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    marginBottom: SIZES.base,
  },
  text: {
    fontSize: SIZES.fontMd,
    color: COLORS.danger,
    ...FONTS.medium,
  },
  successContainer: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    marginBottom: SIZES.base,
  },
  successText: {
    fontSize: SIZES.fontMd,
    color: COLORS.success,
    ...FONTS.medium,
  },
});

export { ErrorBanner, SuccessBanner };
