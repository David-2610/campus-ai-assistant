import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { formatDate } from '../../utils/helpers';
import api from '../../api/api';

const ManageResourcesScreen = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/resources/${activeTab}`);
      setResources(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const handleAction = (id, action) => {
    const messages = {
      approve: 'Approve this resource?',
      reject: 'Reject this resource?',
      delete: 'Delete this resource permanently?',
    };
    Alert.alert('Confirm', messages[action], [
      { text: 'Cancel', style: 'cancel' },
      {
        text: action.charAt(0).toUpperCase() + action.slice(1),
        style: action === 'delete' ? 'destructive' : 'default',
        onPress: async () => {
          try {
            setActionLoading(id);
            if (action === 'delete') {
              await api.delete(`/admin/resources/${id}`);
            } else {
              await api.patch(`/admin/resources/${id}/${action}`);
            }
            await fetchResources();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || `Failed to ${action} resource`);
          } finally {
            setActionLoading(null);
          }
        },
      },
    ]);
  };

  const tabs = [
    { key: 'pending', label: 'Pending', color: '#F39C12' },
    { key: 'approved', label: 'Approved', color: '#27AE60' },
    { key: 'rejected', label: 'Rejected', color: '#E74C3C' },
  ];

  const renderResource = ({ item }) => (
    <View style={styles.resourceCard}>
      <View style={styles.resourceHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.resourceTitle}>{item.title}</Text>
          <Text style={styles.resourceMeta}>
            {item.type} • {item.branch} • Sem {item.semester}
          </Text>
        </View>
      </View>

      <View style={styles.resourceDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Subject:</Text>
          <Text style={styles.detailValue}>{item.subject || '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Uploaded by:</Text>
          <Text style={styles.detailValue}>{item.uploadedBy?.name || 'Unknown'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        {activeTab === 'pending' && (
          <>
            <Button
              title={actionLoading === item._id ? '...' : 'Approve'}
              size="sm"
              variant="success"
              disabled={actionLoading === item._id}
              onPress={() => handleAction(item._id, 'approve')}
              style={{ flex: 1 }}
            />
            <Button
              title={actionLoading === item._id ? '...' : 'Reject'}
              size="sm"
              variant="secondary"
              disabled={actionLoading === item._id}
              onPress={() => handleAction(item._id, 'reject')}
              style={{ flex: 1 }}
            />
          </>
        )}
        <Button
          title={actionLoading === item._id ? '...' : 'Delete'}
          size="sm"
          variant="danger"
          disabled={actionLoading === item._id}
          onPress={() => handleAction(item._id, 'delete')}
          style={activeTab === 'pending' ? {} : { flex: 1 }}
        />
      </View>
    </View>
  );

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Manage Resources</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: COLORS.brandOrange }]}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ErrorBanner message={error} style={{ marginHorizontal: 16 }} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={resources}
          renderItem={renderResource}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState emoji="📂" title={`No ${activeTab} resources`} subtitle="Nothing to show here" />
          }
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { padding: 16, paddingBottom: 4 },
  pageTitle: { fontSize: SIZES.fontXxl, color: COLORS.brandDark, ...FONTS.bold },
  tabBar: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder,
    marginHorizontal: 16, marginBottom: 8,
  },
  tab: { flex: 1, paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent', alignItems: 'center' },
  tabText: { fontSize: SIZES.fontMd, color: COLORS.gray500, ...FONTS.bold },
  tabTextActive: { color: COLORS.brandOrange },
  list: { padding: 16, gap: 12 },
  resourceCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm,
  },
  resourceHeader: { flexDirection: 'row', marginBottom: 10 },
  resourceTitle: { fontSize: SIZES.fontBase, color: COLORS.brandDark, ...FONTS.bold },
  resourceMeta: { fontSize: SIZES.fontSm, color: COLORS.gray500, marginTop: 2 },
  resourceDetails: { gap: 4, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.gray100, marginBottom: 12 },
  detailRow: { flexDirection: 'row', gap: 8 },
  detailLabel: { fontSize: SIZES.fontSm, color: COLORS.gray500, ...FONTS.semibold, width: 90 },
  detailValue: { fontSize: SIZES.fontSm, color: COLORS.brandDark, flex: 1 },
  actionRow: { flexDirection: 'row', gap: 8 },
});

export default ManageResourcesScreen;
