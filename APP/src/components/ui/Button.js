import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  size = 'md',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          btn: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.cardBorder },
          text: { color: COLORS.brandDark },
        };
      case 'danger':
        return {
          btn: { backgroundColor: COLORS.danger },
          text: { color: COLORS.white },
        };
      case 'success':
        return {
          btn: { backgroundColor: COLORS.success },
          text: { color: COLORS.white },
        };
      case 'outline':
        return {
          btn: { backgroundColor: COLORS.transparent, borderWidth: 1.5, borderColor: COLORS.brandOrange },
          text: { color: COLORS.brandOrange },
        };
      case 'ghost':
        return {
          btn: { backgroundColor: COLORS.transparent },
          text: { color: COLORS.brandOrange },
        };
      default:
        return {
          btn: { backgroundColor: COLORS.brandMaroon },
          text: { color: COLORS.white },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          btn: { paddingVertical: 8, paddingHorizontal: 14 },
          text: { fontSize: SIZES.fontSm },
        };
      case 'lg':
        return {
          btn: { paddingVertical: 16, paddingHorizontal: 28 },
          text: { fontSize: SIZES.fontLg },
        };
      default:
        return {
          btn: { paddingVertical: 12, paddingHorizontal: 20 },
          text: { fontSize: SIZES.fontBase },
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        variantStyle.btn,
        sizeStyle.btn,
        SHADOWS.sm,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.text.color}
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, variantStyle.text, sizeStyle.text, FONTS.bold, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    gap: 8,
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
