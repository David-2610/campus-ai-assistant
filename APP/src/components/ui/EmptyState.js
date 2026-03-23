import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const EmptyState = ({ emoji = '📭', title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.fontXl,
    color: COLORS.brandDark,
    textAlign: 'center',
    marginBottom: 8,
    ...FONTS.semibold,
  },
  subtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.gray500,
    textAlign: 'center',
  },
});

export default EmptyState;
