import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { formatDateTime } from '../../utils/helpers';
import api from '../../api/api';

const screenWidth = Dimensions.get('window').width - 64;
const CHART_COLORS = ['#D35400', '#C0392B', '#E67E22', '#E74C3C', '#F39C12', '#9B59B6'];

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalResources: 0, pendingResources: 0, approvedResources: 0,
    rejectedResources: 0, totalUsers: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, analyticsRes, logsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/analytics'),
        api.get('/admin/audit-logs?limit=8'),
      ]);
      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setAuditLogs(logsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ScreenWrapper><LoadingSpinner /></ScreenWrapper>;

  const statCards = [
    { label: 'Total Resources', value: stats.totalResources, icon: 'document-text', color: COLORS.brandOrange, bg: COLORS.brandLight },
    { label: 'Pending', value: stats.pendingResources, icon: 'time', color: '#F39C12', bg: '#FEF9E7' },
    { label: 'Approved', value: stats.approvedResources, icon: 'checkmark-circle', color: '#27AE60', bg: '#EAFAF1' },
    { label: 'Rejected', value: stats.rejectedResources, icon: 'close-circle', color: '#E74C3C', bg: '#FDEDEC' },
    { label: 'Total Users', value: stats.totalUsers, icon: 'people', color: COLORS.brandMaroon, bg: COLORS.brandLight },
  ];

  const pieData = analytics?.resourcesByBranch?.map((item, idx) => ({
    name: item.name,
    count: item.value,
    color: CHART_COLORS[idx % CHART_COLORS.length],
    legendFontColor: COLORS.gray700,
    legendFontSize: 11,
  })) || [];

  const barData = analytics?.resourcesByType ? {
    labels: analytics.resourcesByType.map(i => i.name?.substring(0, 6) || ''),
    datasets: [{ data: analytics.resourcesByType.map(i => i.value) }],
  } : null;

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Admin Dashboard</Text>
      <ErrorBanner message={error} />

      {/* Stat Cards */}
      <View style={styles.statsGrid}>
        {statCards.map((card, idx) => (
          <View key={idx} style={styles.statCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statLabel}>{card.label}</Text>
              <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
            </View>
            <View style={[styles.statIcon, { backgroundColor: card.bg }]}>
              <Ionicons name={card.icon} size={22} color={card.color} />
            </View>
          </View>
        ))}
      </View>

      {/* Charts */}
      {pieData.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Resources By Branch</Text>
          <PieChart
            data={pieData}
            width={screenWidth}
            height={200}
            chartConfig={{
              color: () => COLORS.brandOrange,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        </View>
      )}

      {barData && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Resources By Type</Text>
          <BarChart
            data={barData}
            width={screenWidth}
            height={220}
            yAxisSuffix=""
            fromZero
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: () => COLORS.brandOrange,
              labelColor: () => COLORS.gray600,
              barPercentage: 0.6,
              propsForBackgroundLines: { stroke: COLORS.gray200 },
            }}
            style={{ borderRadius: 12 }}
          />
        </View>
      )}

      {/* Audit Logs */}
      {auditLogs.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Recent Activity</Text>
          {auditLogs.map((log) => (
            <View key={log._id} style={styles.logItem}>
              <View style={styles.logDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logDesc}>
                  <Text style={styles.logAdmin}>{log.adminId?.name || 'Unknown'}</Text>
                  {' — '}{log.description}
                </Text>
                <View style={styles.logMeta}>
                  <View style={styles.logAction}>
                    <Text style={styles.logActionText}>{log.action?.replace('_', ' ')}</Text>
                  </View>
                  <Text style={styles.logDate}>{formatDateTime(log.createdAt)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {[
            { label: 'Manage Resources', screen: 'AdminResources', color: COLORS.brandMaroon },
            { label: 'Manage Notices', screen: 'AdminNotifications', color: COLORS.brandOrange },
            { label: 'Manage Users', screen: 'AdminUsers', color: COLORS.brandDark },
            { label: 'Manage Reports', screen: 'AdminReports', color: COLORS.danger },
            { label: 'Manage Metadata', screen: 'AdminMetadata', color: '#27AE60' },
          ].map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={[styles.quickBtn, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.quickBtnText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: SIZES.fontXxl, color: COLORS.brandDark, ...FONTS.bold, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder, paddingBottom: 12 },
  statsGrid: { gap: 10, marginBottom: 16 },
  statCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm,
  },
  statLabel: { fontSize: SIZES.fontXs, color: COLORS.gray600, ...FONTS.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: SIZES.fontXxl, ...FONTS.bold, marginTop: 4 },
  statIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  chartCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm, marginBottom: 16,
  },
  chartTitle: { fontSize: SIZES.fontLg, color: COLORS.brandDark, ...FONTS.bold, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.gray100, paddingBottom: 8 },
  logItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  logDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.brandOrange, marginTop: 6 },
  logDesc: { fontSize: SIZES.fontMd, color: COLORS.brandDark },
  logAdmin: { color: COLORS.brandMaroon, ...FONTS.semibold },
  logMeta: { flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center' },
  logAction: { backgroundColor: 'rgba(245, 176, 65, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  logActionText: { fontSize: SIZES.fontXs, color: COLORS.brandMaroon, ...FONTS.medium, textTransform: 'capitalize' },
  logDate: { fontSize: SIZES.fontXs, color: COLORS.gray500 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: SIZES.radius },
  quickBtnText: { color: COLORS.white, fontSize: SIZES.fontSm, ...FONTS.bold },
});

export default DashboardScreen;
