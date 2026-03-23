import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { BRANCHES, SEMESTERS, GRADUATION_YEARS } from '../../constants/constants';
import api from '../../api/api';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    semester: '',
    graduationYear: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBranchPicker, setShowBranchPicker] = useState(false);
  const [showSemesterPicker, setShowSemesterPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!form.branch) newErrors.branch = 'Branch is required';
    if (!form.semester) newErrors.semester = 'Semester is required';
    if (!form.graduationYear) newErrors.graduationYear = 'Batch is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/auth/register', {
        ...form,
        semester: parseInt(form.semester, 10),
        graduationYear: parseInt(form.graduationYear, 10),
      });
      navigation.navigate('Login', {
        message: 'Registration successful! Please login to continue.',
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const PickerButton = ({ label, value, placeholder, error: fieldError, onPress }) => (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.pickerLabel}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.pickerBtn, fieldError && { borderColor: COLORS.danger }]}
      >
        <Text style={[styles.pickerText, !value && { color: COLORS.gray400 }]}>
          {value || placeholder}
        </Text>
        <Text style={styles.pickerArrow}>▼</Text>
      </TouchableOpacity>
      {fieldError && <Text style={styles.errorText}>{fieldError}</Text>}
    </View>
  );

  const PickerModal = ({ visible, options, onSelect, onClose, title }) => {
    if (!visible) return null;
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {options.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.modalOption}
                onPress={() => {
                  onSelect(typeof option === 'object' ? option.value : String(option));
                  onClose();
                }}
              >
                <Text style={styles.modalOptionText}>
                  {typeof option === 'object' ? option.label : String(option)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.modalCancel}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.centerContainer}>
          <View style={styles.card}>
            <View style={styles.headerSection}>
              <Text style={styles.logoEmoji}>🎓</Text>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the campus community</Text>
            </View>

            <ErrorBanner message={error} />

            <View style={styles.formSection}>
              <Input
                label="Full Name"
                value={form.name}
                onChangeText={(v) => handleChange('name', v)}
                placeholder="Enter your full name"
                autoCapitalize="words"
                required
                error={errors.name}
              />
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

              <PickerButton
                label="Branch"
                value={BRANCHES.find(b => b.value === form.branch)?.label}
                placeholder="Select your branch"
                error={errors.branch}
                onPress={() => setShowBranchPicker(true)}
              />

              <PickerButton
                label="Semester"
                value={form.semester ? `Semester ${form.semester}` : ''}
                placeholder="Select your semester"
                error={errors.semester}
                onPress={() => setShowSemesterPicker(true)}
              />

              <PickerButton
                label="Batch (Graduation Year)"
                value={form.graduationYear ? `Class of ${form.graduationYear}` : ''}
                placeholder="Select your graduation year"
                error={errors.graduationYear}
                onPress={() => setShowYearPicker(true)}
              />

              <Button
                title="Register"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.submitBtn}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Login here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Picker Modals */}
      <PickerModal
        visible={showBranchPicker}
        title="Select Branch"
        options={BRANCHES}
        onSelect={(v) => handleChange('branch', v)}
        onClose={() => setShowBranchPicker(false)}
      />
      <PickerModal
        visible={showSemesterPicker}
        title="Select Semester"
        options={SEMESTERS.map(s => ({ value: String(s), label: `Semester ${s}` }))}
        onSelect={(v) => handleChange('semester', v)}
        onClose={() => setShowSemesterPicker(false)}
      />
      <PickerModal
        visible={showYearPicker}
        title="Select Graduation Year"
        options={GRADUATION_YEARS.map(y => ({ value: String(y), label: `Class of ${y} (Batch ${y})` }))}
        onSelect={(v) => handleChange('graduationYear', v)}
        onClose={() => setShowYearPicker(false)}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    paddingVertical: 12,
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
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 48,
    marginBottom: 12,
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
    gap: 14,
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
  // Picker Button
  pickerLabel: {
    fontSize: SIZES.fontMd,
    color: COLORS.brandDark,
    marginBottom: 6,
    ...FONTS.medium,
  },
  required: {
    color: COLORS.brandOrange,
  },
  pickerBtn: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: SIZES.fontBase,
    color: COLORS.brandDark,
  },
  pickerArrow: {
    fontSize: 10,
    color: COLORS.gray500,
  },
  errorText: {
    fontSize: SIZES.fontSm,
    color: COLORS.danger,
    marginTop: 4,
    ...FONTS.medium,
  },
  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: SIZES.fontLg,
    color: COLORS.brandDark,
    ...FONTS.bold,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  modalOptionText: {
    fontSize: SIZES.fontBase,
    color: COLORS.brandDark,
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: SIZES.fontBase,
    color: COLORS.danger,
    ...FONTS.bold,
  },
});

export default RegisterScreen;
