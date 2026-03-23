import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Image, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { ErrorBanner, SuccessBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { NOTICE_CATEGORIES, API_BASE_URL } from '../../constants/constants';
import { getCategoryColor, formatDate, formatDateTime } from '../../utils/helpers';
import api from '../../api/api';

const ManageNotificationsScreen = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '', content: '', category: 'notice',
    targetBranch: '', targetYear: '', expiresAt: '', image: null,
  });

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotices(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      handleChange('image', result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('category', form.category);
      if (form.targetBranch) formData.append('targetBranch', form.targetBranch);
      if (form.targetYear) formData.append('targetYear', form.targetYear);
      if (form.expiresAt) formData.append('expiresAt', form.expiresAt);
      if (form.image) {
        formData.append('image', {
          uri: Platform.OS === 'android' ? form.image.uri : form.image.uri.replace('file://', ''),
          name: form.image.fileName || 'notice.jpg',
          type: form.image.mimeType || 'image/jpeg',
        });
      }

      const token = await SecureStore.getItemAsync('token');
      const uploadUrl = (API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/') + 'admin/notifications';

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseData.message || `Upload failed with status ${response.status}`);
      }

      setSuccess('Notice created successfully!');
      setForm({ title: '', content: '', category: 'notice', targetBranch: '', targetYear: '', expiresAt: '', image: null });
      setShowForm(false);
      fetchNotices();
    } catch (err) {
      setError(err.message || 'Failed to create notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Notice', 'Delete this notice permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/notifications/${id}`);
            fetchNotices();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete');
          }
        },
      },
    ]);
  };

  const renderNotice = ({ item: notice }) => {
    const catColor = getCategoryColor(notice.category);
    return (
      <View style={styles.noticeCard}>
        <View style={styles.noticeHeader}>
          <View style={{ flex: 1 }}>
            <View style={[styles.catBadge, { backgroundColor: catColor.bg }]}>
              <Text style={[styles.catText, { color: catColor.text }]}>{notice.category?.toUpperCase()}</Text>
            </View>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(notice._id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
        {notice.imageUrl && (
          <Image source={{ uri: notice.imageUrl }} style={styles.noticeImage} resizeMode="cover" />
        )}
        <Text style={styles.noticeContent} numberOfLines={3}>{notice.content}</Text>
        <View style={styles.noticeTags}>
          {notice.targetBranch && <View style={styles.tag}><Text style={styles.tagText}>Branch: {notice.targetBranch}</Text></View>}
          {notice.targetYear && <View style={styles.tag}><Text style={styles.tagText}>Year: {notice.targetYear}</Text></View>}
          {notice.expiresAt && <View style={[styles.tag, { borderColor: COLORS.brandOrange }]}><Text style={[styles.tagText, { color: COLORS.brandOrange }]}>Exp: {formatDate(notice.expiresAt)}</Text></View>}
        </View>
        <View style={styles.noticeFooter}>
          <Text style={styles.footerText}>Posted {formatDateTime(notice.createdAt)}</Text>
          <View style={styles.viewsBadge}>
            <Text style={styles.viewsText}>{notice.views || 0} Views</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Manage Notices</Text>
          <Text style={styles.pageSubtitle}>Create and manage announcements</Text>
        </View>
        <Button
          title={showForm ? 'Close' : '+ New'}
          size="sm"
          variant={showForm ? 'secondary' : 'primary'}
          onPress={() => setShowForm(!showForm)}
        />
      </View>

      <ErrorBanner message={error} style={{ marginHorizontal: 16 }} />
      <SuccessBanner message={success} style={{ marginHorizontal: 16 }} />

      {/* Create Form */}
      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Post New Notice</Text>
          <Input label="Title" value={form.title} onChangeText={(v) => handleChange('title', v)} placeholder="Notice title" required />
          <Input label="Content" value={form.content} onChangeText={(v) => handleChange('content', v)} placeholder="Details..." multiline numberOfLines={4} required />
          <View style={styles.catRow}>
            {NOTICE_CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} onPress={() => handleChange('category', cat)}
                style={[styles.catOption, form.category === cat && styles.catOptionActive]}>
                <Text style={[styles.catOptionText, form.category === cat && styles.catOptionTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Input label="Target Branch" value={form.targetBranch} onChangeText={(v) => handleChange('targetBranch', v)} placeholder="e.g. CSE" style={{ flex: 1 }} />
            <Input label="Target Year" value={form.targetYear} onChangeText={(v) => handleChange('targetYear', v)} placeholder="e.g. 2" keyboardType="numeric" style={{ flex: 1 }} />
          </View>
          <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
            <Ionicons name="image-outline" size={24} color={COLORS.gray500} />
            <Text style={styles.imagePickerText}>{form.image ? 'Image selected ✓' : 'Attach Image (Optional)'}</Text>
          </TouchableOpacity>
          <Button title="Broadcast Notice" onPress={handleSubmit} loading={submitting} style={{ backgroundColor: COLORS.brandMaroon }} />
        </View>
      )}

      {/* Notice List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Active Notices</Text>
        <View style={styles.countBadge}><Text style={styles.countText}>{notices.length} Total</Text></View>
      </View>

      {loading ? <LoadingSpinner /> : (
        <FlatList
          data={notices}
          renderItem={renderNotice}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState emoji="📢" title="No active notices" subtitle="Create one above" />}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  pageTitle: { fontSize: SIZES.fontXxl, color: COLORS.brandDark, ...FONTS.bold },
  pageSubtitle: { fontSize: SIZES.fontSm, color: COLORS.gray500, marginTop: 2 },
  formCard: { margin: 16, backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm, gap: 12 },
  formTitle: { fontSize: SIZES.fontLg, color: COLORS.brandDark, ...FONTS.bold, borderBottomWidth: 1, borderBottomColor: COLORS.gray100, paddingBottom: 8 },
  catRow: { flexDirection: 'row', gap: 8 },
  catOption: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: SIZES.radiusFull, backgroundColor: COLORS.gray100 },
  catOptionActive: { backgroundColor: COLORS.brandOrange },
  catOptionText: { fontSize: SIZES.fontSm, color: COLORS.gray700, ...FONTS.medium, textTransform: 'capitalize' },
  catOptionTextActive: { color: COLORS.white, ...FONTS.bold },
  imagePicker: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.inputBorder, borderRadius: SIZES.radius, backgroundColor: COLORS.inputBg },
  imagePickerText: { fontSize: SIZES.fontMd, color: COLORS.gray600 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  listTitle: { fontSize: SIZES.fontLg, color: COLORS.brandDark, ...FONTS.bold },
  countBadge: { backgroundColor: COLORS.brandLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: SIZES.radiusFull, borderWidth: 1, borderColor: COLORS.cardBorder },
  countText: { fontSize: SIZES.fontSm, color: COLORS.brandMaroon, ...FONTS.bold },
  list: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  noticeCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm, overflow: 'hidden' },
  noticeHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, paddingBottom: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 6 },
  catText: { fontSize: SIZES.fontXs, ...FONTS.bold, letterSpacing: 0.5 },
  noticeTitle: { fontSize: SIZES.fontBase, color: COLORS.brandDark, ...FONTS.bold },
  deleteBtn: { padding: 6, borderRadius: SIZES.radius, backgroundColor: COLORS.dangerLight },
  noticeImage: { width: '100%', height: 120, backgroundColor: COLORS.brandLight },
  noticeContent: { fontSize: SIZES.fontSm, color: COLORS.gray600, paddingHorizontal: 14, paddingVertical: 8, lineHeight: 20 },
  noticeTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, marginBottom: 8 },
  tag: { backgroundColor: COLORS.brandLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1, borderColor: COLORS.cardBorder },
  tagText: { fontSize: SIZES.fontXs, color: COLORS.gray600, ...FONTS.medium },
  noticeFooter: { backgroundColor: 'rgba(255,245,240,0.5)', paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.cardBorder, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: SIZES.fontXs, color: COLORS.gray500 },
  viewsBadge: { backgroundColor: 'rgba(245,176,65,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  viewsText: { fontSize: SIZES.fontXs, color: COLORS.brandMaroon, ...FONTS.bold },
});

export default ManageNotificationsScreen;
