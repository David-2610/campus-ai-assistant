import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { getStatusColor, formatDate } from '../../utils/helpers';
import api from '../../api/api';

const ManageReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/reports');
      setReports(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (reportId, status) => {
    Alert.alert('Confirm', `Mark this report as ${status}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await api.patch(`/admin/reports/${reportId}/resolve`, { status });
            fetchReports();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update report');
          }
        },
      },
    ]);
  };

  const handleDeleteResource = (resourceId, reportId) => {
    Alert.alert('Delete Resource', 'Delete the underlying resource permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/resources/${resourceId}`);
            await api.patch(`/admin/reports/${reportId}/resolve`, { status: 'resolved' });
            fetchReports();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete resource');
          }
        },
      },
    ]);
  };

  const renderReport = ({ item: report }) => {
    const statusColor = getStatusColor(report.status);
    const isPending = report.status === 'pending';

    return (
      <View style={[styles.reportCard, isPending && { borderColor: COLORS.dangerBorder }]}>
        <View style={styles.reportHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>{report.status?.toUpperCase()}</Text>
          </View>
          <Text style={styles.reportDate}>Reported {formatDate(report.createdAt)}</Text>
        </View>

        <Text style={styles.reportTarget}>
          Target: {report.resourceId ? report.resourceId.title : '(Deleted Resource)'}
        </Text>

        {report.resourceId && (
          <Text style={styles.reportMeta}>
            {report.resourceId.type} • {report.resourceId.branch} • Sem {report.resourceId.semester}
          </Text>
        )}

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>
            Reason by {report.reportedBy?.name || 'Unknown'}:
          </Text>
          <Text style={styles.reasonText}>"{report.reason}"</Text>
        </View>

        {isPending && (
          <View style={styles.actions}>
            {report.resourceId && (
              <Button
                title="Delete Resource"
                variant="danger"
                size="sm"
                onPress={() => handleDeleteResource(report.resourceId._id, report._id)}
                style={{ flex: 1 }}
              />
            )}
            <Button
              title="Dismiss"
              variant="secondary"
              size="sm"
              onPress={() => handleStatusChange(report._id, 'dismissed')}
              style={{ flex: 1 }}
            />
            {!report.resourceId && (
              <Button
                title="Resolve"
                variant="success"
                size="sm"
                onPress={() => handleStatusChange(report._id, 'resolved')}
                style={{ flex: 1 }}
              />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Resource Reports</Text>
        <Text style={styles.pageSubtitle}>Review flagged content and moderate</Text>
      </View>

      <ErrorBanner message={error} style={{ marginHorizontal: 16 }} />

      {loading ? <LoadingSpinner /> : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState emoji="✅" title="No reports found" subtitle="Great job! All clear." />}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { padding: 16, paddingBottom: 8 },
  pageTitle: { fontSize: SIZES.fontXxl, color: COLORS.brandDark, ...FONTS.bold },
  pageSubtitle: { fontSize: SIZES.fontSm, color: COLORS.gray500, marginTop: 2 },
  list: { padding: 16, gap: 12 },
  reportCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm,
  },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: SIZES.fontXs, ...FONTS.bold },
  reportDate: { fontSize: SIZES.fontXs, color: COLORS.gray500 },
  reportTarget: { fontSize: SIZES.fontBase, color: COLORS.brandDark, ...FONTS.bold, marginBottom: 4 },
  reportMeta: { fontSize: SIZES.fontSm, color: COLORS.brandMaroon, ...FONTS.semibold, marginBottom: 10 },
  reasonBox: {
    backgroundColor: COLORS.dangerLight, borderWidth: 1, borderColor: COLORS.dangerBorder,
    borderRadius: SIZES.radius, padding: 12, marginBottom: 12,
  },
  reasonLabel: { fontSize: SIZES.fontSm, color: COLORS.danger, ...FONTS.semibold, marginBottom: 4 },
  reasonText: { fontSize: SIZES.fontMd, color: COLORS.danger, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: 8 },
});

export default ManageReportsScreen;
