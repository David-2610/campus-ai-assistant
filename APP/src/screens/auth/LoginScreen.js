import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ErrorBanner, SuccessBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const LoginScreen = ({ navigation, route }) => {
  const { login } = useAuth();
  const successMessage = route?.params?.message;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      await login(response.data.token, response.data.user);
      // Navigation will automatically switch to the main app via AppNavigator
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.centerContainer}>
          <View style={styles.card}>
            {/* Logo / Header */}
            <View style={styles.headerSection}>
              <Image source={require('../../../assets/icon.png')} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.title}>JK Connect</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            <SuccessBanner message={successMessage} />
            <ErrorBanner message={error} />

            <View style={styles.formSection}>
              <Input
                label="Email Address"
                value={form.email}
                onChangeText={(v) => handleChange('email', v)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                required
                error={errors.email}
              />

              <Input
                label="Password"
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                placeholder="Enter your password"
                secureTextEntry
                required
                error={errors.password}
              />

              <Button
                title="Login"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.submitBtn}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Register here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 28,
    ...SHADOWS.md,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: SIZES.fontXxl,
    color: COLORS.brandDark,
    ...FONTS.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: SIZES.fontBase,
    color: COLORS.gray500,
  },
  formSection: {
    gap: 16,
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: COLORS.brandMaroon,
    paddingVertical: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: SIZES.fontMd,
    color: COLORS.gray600,
  },
  linkText: {
    fontSize: SIZES.fontMd,
    color: COLORS.brandOrange,
    ...FONTS.bold,
  },
});

export default LoginScreen;
