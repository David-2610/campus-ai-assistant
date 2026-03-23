import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import api from '../../api/api';

const TABS = [
  { id: 'branch', label: 'Branches' },
  { id: 'subject', label: 'Subjects' },
  { id: 'type', label: 'Types' },
  { id: 'examType', label: 'Exam Types' },
];

const ManageMetadataScreen = () => {
  const [metadata, setMetadata] = useState({ branch: [], subject: [], type: [], examType: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('branch');
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ value: '', priority: '0' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchMetadata(); }, []);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/metadata');
      setMetadata({
        branch: data.branch || [], subject: data.subject || [],
        type: data.type || [], examType: data.examType || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.value.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/admin/metadata', {
        type: activeTab,
        value: form.value.trim(),
        priority: parseInt(form.priority, 10) || 0,
      });
      setForm({ value: '', priority: '0' });
      fetchMetadata();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add metadata');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Delete this metadata entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/metadata/${id}`);
            fetchMetadata();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete');
          }
        },
      },
    ]);
  };

  const handleToggleActive = async (item) => {
    try {
      await api.patch(`/admin/metadata/${item._id}`, { isActive: !item.isActive });
      fetchMetadata();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update');
    }
  };

  const currentItems = metadata[activeTab] || [];

  const renderItem = ({ item }) => (
    <View style={[styles.metaItem, !item.isActive && styles.metaItemInactive]}>
      <View style={{ flex: 1 }}>
        <View style={styles.metaNameRow}>
          <Text style={styles.metaName}>{item.value}</Text>
          {!item.isActive && (
            <View style={styles.inactiveBadge}><Text style={styles.inactiveText}>Inactive</Text></View>
          )}
        </View>
        <Text style={styles.metaPriority}>Priority: {item.priority}</Text>
      </View>
      <View style={styles.metaActions}>
        <TouchableOpacity
          onPress={() => handleToggleActive(item)}
          style={[styles.toggleBtn, item.isActive ? styles.deactivateBtn : styles.activateBtn]}
        >
          <Text style={[styles.toggleText, !item.isActive && { color: COLORS.success }]}>
            {item.isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && currentItems.length === 0) {
    return <ScreenWrapper><LoadingSpinner /></ScreenWrapper>;
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Manage Metadata</Text>
        <Text style={styles.pageSubtitle}>Add, edit, or remove dropdown options</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => { setActiveTab(tab.id); setError(null); }}
            style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ErrorBanner message={error} style={{ marginHorizontal: 16 }} />

      {/* Add Form */}
      <View style={styles.addForm}>
        <Text style={styles.addTitle}>Add New {activeTab}</Text>
        <View style={styles.addRow}>
          <Input
            value={form.value}
            onChangeText={(v) => setForm(p => ({ ...p, value: v }))}
            placeholder={`New ${activeTab} value`}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <Input
            value={form.priority}
            onChangeText={(v) => setForm(p => ({ ...p, priority: v }))}
            placeholder="0"
            keyboardType="numeric"
            style={{ width: 60, marginBottom: 0 }}
          />
          <Button
            title="Add"
            size="sm"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || !form.value.trim()}
            style={{ backgroundColor: COLORS.brandMaroon }}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={currentItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState emoji="⚙️" title="No entries" subtitle="Add one above" />}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { padding: 16, paddingBottom: 8 },
  pageTitle: { fontSize: SIZES.fontXxl, color: COLORS.brandDark, ...FONTS.bold },
  pageSubtitle: { fontSize: SIZES.fontSm, color: COLORS.gray500, marginTop: 2 },
  tabScroll: { flexGrow: 0, marginBottom: 12 },
  tabContainer: { paddingHorizontal: 16, gap: 8 },
  tabBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: SIZES.radius,
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  tabBtnActive: { backgroundColor: COLORS.brandOrange, borderColor: COLORS.brandOrange },
  tabText: { fontSize: SIZES.fontSm, color: COLORS.gray700, ...FONTS.bold },
  tabTextActive: { color: COLORS.white },
  addForm: {
    marginHorizontal: 16, backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    padding: 14, borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm, marginBottom: 12,
  },
  addTitle: { fontSize: SIZES.fontBase, color: COLORS.brandDark, ...FONTS.bold, marginBottom: 10, textTransform: 'capitalize' },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  metaItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  metaItemInactive: { opacity: 0.6, backgroundColor: COLORS.gray50 },
  metaNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaName: { fontSize: SIZES.fontBase, color: COLORS.brandDark, ...FONTS.bold },
  metaPriority: { fontSize: SIZES.fontXs, color: COLORS.gray500, ...FONTS.medium, marginTop: 2 },
  inactiveBadge: { backgroundColor: COLORS.gray200, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  inactiveText: { fontSize: SIZES.fontXs, color: COLORS.gray600, ...FONTS.bold },
  metaActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, borderWidth: 1 },
  deactivateBtn: { backgroundColor: COLORS.brandLight, borderColor: COLORS.cardBorder },
  activateBtn: { backgroundColor: COLORS.successLight, borderColor: COLORS.successBorder },
  toggleText: { fontSize: SIZES.fontXs, color: COLORS.brandMaroon, ...FONTS.bold },
  deleteBtn: { padding: 8, borderRadius: 4, backgroundColor: COLORS.dangerLight, borderWidth: 1, borderColor: COLORS.dangerBorder },
});

export default ManageMetadataScreen;
