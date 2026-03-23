import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ErrorBanner, SuccessBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { SEMESTERS, YEARS, API_BASE_URL } from '../../constants/constants';
import * as SecureStore from 'expo-secure-store';
import api from '../../api/api';

const UploadScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [metadata, setMetadata] = useState({ branch: [], subject: [], type: [], examType: [] });

  const [form, setForm] = useState({
    title: '', type: '', subject: '', branch: '',
    semester: '', year: '', examType: '', file: null,
  });

  const [activePicker, setActivePicker] = useState(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const { data } = await api.get('/metadata');
      setMetadata({
        branch: data.branch || [], subject: data.subject || [],
        type: data.type || [], examType: data.examType || [],
      });
    } catch (err) {
      setError('Could not load dropdown values.');
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf', 
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'image/jpeg',
          'image/jpg',
          'image/png'
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        handleChange('file', file);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.type) errors.type = 'Resource type is required';
    if (!form.subject) errors.subject = 'Subject is required';
    if (!form.branch) errors.branch = 'Branch is required';
    if (!form.semester) errors.semester = 'Semester is required';
    if (!form.year) errors.year = 'Year is required';
    if (!form.examType) errors.examType = 'Exam type is required';
    if (!form.file) errors.file = 'Please select a file to upload';
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('type', form.type);
      formData.append('subject', form.subject);
      formData.append('branch', form.branch);
      formData.append('semester', form.semester);
      formData.append('year', form.year);
      formData.append('examType', form.examType);
      
      const fileData = {
        uri: Platform.OS === 'android' ? form.file.uri : form.file.uri.replace('file://', ''),
        name: form.file.name || 'upload.pdf',
        type: form.file.mimeType || 'application/pdf',
      };
      formData.append('file', fileData);

      const token = await SecureStore.getItemAsync('token');
      // Ensure baseURL handles trailing slash logic cleanly like our interceptor
      const uploadUrl = (API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/') + 'resources/upload';

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Do NOT set Content-Type here; fetch will automatically generate multipart/form-data with the correct boundary
        },
        body: formData,
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseData.message || `Upload failed with status ${response.status}`);
      }

      setSuccess('Resource uploaded successfully! It will be reviewed by an admin.');
      setForm({
        title: '', type: '', subject: '', branch: '',
        semester: '', year: '', examType: '', file: null,
      });
    } catch (err) {
      setError(err.message || 'Failed to upload resource.');
    } finally {
      setLoading(false);
    }
  };

  const PickerField = ({ label, value, placeholder, fieldName, options, error: fieldError }) => (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.pickerLabel}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        onPress={() => setActivePicker(activePicker === fieldName ? null : fieldName)}
        style={[styles.pickerBtn, fieldError && { borderColor: COLORS.danger }]}
      >
        <Text style={[styles.pickerText, !value && { color: COLORS.gray400 }]}>
          {value || placeholder}
        </Text>
        <Ionicons name={activePicker === fieldName ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.gray500} />
      </TouchableOpacity>
      {activePicker === fieldName && (
        <View style={styles.pickerDropdown}>
          <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
            {options.map((opt, idx) => {
              const val = typeof opt === 'object' ? opt.value : String(opt);
              const lbl = typeof opt === 'object' ? opt.value : (fieldName === 'semester' ? `Semester ${opt}` : String(opt));
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.pickerOption, form[fieldName] === val && styles.pickerOptionActive]}
                  onPress={() => {
                    handleChange(fieldName, val);
                    setActivePicker(null);
                  }}
                >
                  <Text style={[styles.pickerOptionText, form[fieldName] === val && styles.pickerOptionTextActive]}>
                    {lbl}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
      {fieldError && <Text style={styles.errorText}>{fieldError}</Text>}
    </View>
  );

  if (metadataLoading) {
    return (
      <ScreenWrapper>
        <LoadingSpinner />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Text style={styles.pageTitle}>Upload Resource</Text>

      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      <View style={styles.formCard}>
        <Input
          label="Title"
          value={form.title}
          onChangeText={(v) => handleChange('title', v)}
          placeholder="Enter resource title"
          required
          error={formErrors.title}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <PickerField label="Type" value={form.type} placeholder="Select" fieldName="type" options={metadata.type} error={formErrors.type} />
          </View>
          <View style={{ flex: 1 }}>
            <PickerField label="Subject" value={form.subject} placeholder="Select" fieldName="subject" options={metadata.subject} error={formErrors.subject} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <PickerField label="Branch" value={form.branch} placeholder="Select" fieldName="branch" options={metadata.branch} error={formErrors.branch} />
          </View>
          <View style={{ flex: 1 }}>
            <PickerField label="Exam Type" value={form.examType} placeholder="Select" fieldName="examType" options={metadata.examType} error={formErrors.examType} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <PickerField label="Semester" value={form.semester ? `Sem ${form.semester}` : ''} placeholder="Select" fieldName="semester" options={SEMESTERS} error={formErrors.semester} />
          </View>
          <View style={{ flex: 1 }}>
            <PickerField label="Year" value={form.year} placeholder="Select" fieldName="year" options={YEARS} error={formErrors.year} />
          </View>
        </View>

        {/* File Picker */}
        <View style={{ marginBottom: 4 }}>
          <Text style={styles.pickerLabel}>
            File Document <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={handleFilePick}
            style={[styles.filePicker, formErrors.file && { borderColor: COLORS.danger }]}
          >
            <Ionicons name="cloud-upload-outline" size={32} color={COLORS.gray400} />
            <Text style={styles.filePickerText}>
              {form.file ? form.file.name : 'Tap to select a file'}
            </Text>
            <Text style={styles.filePickerHint}>PDF, DOC, DOCX, PPTX, JPG, PNG</Text>
          </TouchableOpacity>
          {formErrors.file && <Text style={styles.errorText}>{formErrors.file}</Text>}
          {form.file && (
            <View style={styles.selectedFile}>
              <Ionicons name="document-text" size={16} color={COLORS.success} />
              <Text style={styles.selectedFileName}>{form.file.name}</Text>
              <TouchableOpacity onPress={() => handleChange('file', null)}>
                <Ionicons name="close-circle" size={16} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <Button
            title="Upload Resource"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={{ flex: 1, backgroundColor: COLORS.brandMaroon }}
          />
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.navigate('Resources')}
            disabled={loading}
            style={{ paddingHorizontal: 24 }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  pageTitle: { fontSize: SIZES.fontXxl, color: COLORS.brandDark, ...FONTS.bold, marginBottom: 16 },
  formCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg, padding: 20,
    borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm, gap: 14,
  },
  row: { flexDirection: 'row', gap: 12 },
  pickerLabel: { fontSize: SIZES.fontMd, color: COLORS.brandDark, ...FONTS.medium, marginBottom: 6 },
  required: { color: COLORS.brandOrange },
  pickerBtn: {
    backgroundColor: COLORS.inputBg, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radius, paddingHorizontal: 12, paddingVertical: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  pickerText: { fontSize: SIZES.fontMd, color: COLORS.brandDark, flex: 1 },
  pickerDropdown: {
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.cardBorder,
    borderRadius: SIZES.radius, marginTop: 4, ...SHADOWS.md,
  },
  pickerOption: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  pickerOptionActive: { backgroundColor: COLORS.brandLight },
  pickerOptionText: { fontSize: SIZES.fontMd, color: COLORS.brandDark },
  pickerOptionTextActive: { color: COLORS.brandOrange, ...FONTS.bold },
  errorText: { fontSize: SIZES.fontSm, color: COLORS.danger, marginTop: 4, ...FONTS.medium },
  filePicker: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusMd, paddingVertical: 24, alignItems: 'center',
    backgroundColor: COLORS.inputBg, gap: 4,
  },
  filePickerText: { fontSize: SIZES.fontMd, color: COLORS.brandDark },
  filePickerHint: { fontSize: SIZES.fontXs, color: COLORS.gray500 },
  selectedFile: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8,
    backgroundColor: COLORS.successLight, padding: 10, borderRadius: SIZES.radius,
    borderWidth: 1, borderColor: COLORS.successBorder,
  },
  selectedFileName: { flex: 1, fontSize: SIZES.fontSm, color: COLORS.success, ...FONTS.medium },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
});

export default UploadScreen;
