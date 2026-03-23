import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  editable = true,
  style,
  inputStyle,
  autoCapitalize = 'none',
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray400}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
          !editable && styles.disabled,
          inputStyle,
        ]}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: SIZES.fontMd,
    color: COLORS.brandDark,
    marginBottom: 6,
    ...FONTS.medium,
  },
  required: {
    color: COLORS.brandOrange,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base,
    paddingVertical: 12,
    fontSize: SIZES.fontBase,
    color: COLORS.brandDark,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: COLORS.gray100,
  },
  error: {
    fontSize: SIZES.fontSm,
    color: COLORS.danger,
    marginTop: 4,
    ...FONTS.medium,
  },
});

export default Input;
