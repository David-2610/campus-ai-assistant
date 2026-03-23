import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import api from '../../api/api';

const ManageUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ graduationYear: '', role: '', branch: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.graduationYear) params.append('graduationYear', filters.graduationYear);
      if (filters.role) params.append('role', filters.role);
      if (filters.branch) params.append('branch', filters.branch);
      const { data } = await api.get(`/admin/users?${params.toString()}`);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [filters]);

  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    Alert.alert('Change Role', `Change user role to ${newRole}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await api.patch(`/admin/users/${userId}/role`, { role: newRole });
            fetchUsers();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update role');
          }
        },
      },
    ]);
  };

  const handleStatusToggle = (userId, isActive) => {
    Alert.alert(isActive ? 'Suspend User' : 'Unban User', `Are you sure?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        style: isActive ? 'destructive' : 'default',
        onPress: async () => {
          try {
            await api.patch(`/admin/users/${userId}/status`, { isActive: !isActive });
            fetchUsers();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update status');
          }
        },
      },
    ]);
  };

  const FilterChip = ({ label, active, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderUser = ({ item: user }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase() || '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: user.isActive ? COLORS.successLight : COLORS.dangerLight }]}>
          <Text style={[styles.statusText, { color: user.isActive ? COLORS.success : COLORS.danger }]}>
            {user.isActive ? 'Active' : 'Banned'}
          </Text>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Branch</Text>
          <Text style={styles.detailValue}>{user.branch || '—'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Batch</Text>
          <Text style={styles.detailValue}>{user.graduationYear || '—'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Role</Text>
          <TouchableOpacity onPress={() => handleRoleChange(user._id, user.role)}
            style={[styles.roleBadge, user.role === 'admin' && styles.roleBadgeAdmin]}>
            <Text style={[styles.roleText, user.role === 'admin' && styles.roleTextAdmin]}>{user.role}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleStatusToggle(user._id, user.isActive)}
        style={[styles.actionBtn, user.isActive ? styles.suspendBtn : styles.unbanBtn]}
      >
        <Ionicons name={user.isActive ? 'ban' : 'checkmark-circle'} size={16} color={user.isActive ? COLORS.danger : COLORS.white} />
        <Text style={[styles.actionText, !user.isActive && { color: COLORS.white }]}>
          {user.isActive ? 'Suspend' : 'Unban'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>User Management</Text>
        <Text style={styles.pageSubtitle}>Manage accounts and permissions</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <FilterChip label="All Roles" active={!filters.role} onPress={() => setFilters(p => ({ ...p, role: '' }))} />
        <FilterChip label="Students" active={filters.role === 'student'} onPress={() => setFilters(p => ({ ...p, role: 'student' }))} />
        <FilterChip label="Admins" active={filters.role === 'admin'} onPress={() => setFilters(p => ({ ...p, role: 'admin' }))} />
      </View>

      <ErrorBanner message={error} style={{ marginHorizontal: 16 }} />

      {loading ? <LoadingSpinner /> : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState emoji="👥" title="No users found" subtitle="Try adjusting filters" />}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { padding: 16, paddingBottom: 8 },
  pageTitle: { fontSize: SIZES.fontXxl, color: COLORS.brandDark, ...FONTS.bold },
  pageSubtitle: { fontSize: SIZES.fontSm, color: COLORS.gray500, marginTop: 2 },
  filtersRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: SIZES.radiusFull, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.cardBorder },
  filterChipActive: { backgroundColor: COLORS.brandOrange, borderColor: COLORS.brandOrange },
  filterChipText: { fontSize: SIZES.fontSm, color: COLORS.gray700, ...FONTS.medium },
  filterChipTextActive: { color: COLORS.white, ...FONTS.bold },
  list: { padding: 16, gap: 12 },
  userCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm },
  userHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.brandMaroon, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: SIZES.fontLg, color: COLORS.white, ...FONTS.bold },
  userName: { fontSize: SIZES.fontBase, color: COLORS.brandDark, ...FONTS.bold },
  userEmail: { fontSize: SIZES.fontSm, color: COLORS.gray500 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: SIZES.radiusFull },
  statusText: { fontSize: SIZES.fontXs, ...FONTS.bold },
  userDetails: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.gray100, marginBottom: 12 },
  detailItem: { flex: 1, alignItems: 'center' },
  detailLabel: { fontSize: SIZES.fontXs, color: COLORS.gray500, ...FONTS.medium, marginBottom: 4 },
  detailValue: { fontSize: SIZES.fontMd, color: COLORS.brandDark, ...FONTS.semibold },
  roleBadge: { backgroundColor: COLORS.gray100, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4 },
  roleBadgeAdmin: { backgroundColor: 'rgba(93,64,55,0.1)' },
  roleText: { fontSize: SIZES.fontSm, color: COLORS.gray700, ...FONTS.medium, textTransform: 'capitalize' },
  roleTextAdmin: { color: COLORS.brandMaroon, ...FONTS.bold },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: SIZES.radius },
  suspendBtn: { backgroundColor: COLORS.dangerLight, borderWidth: 1, borderColor: COLORS.dangerBorder },
  unbanBtn: { backgroundColor: COLORS.success },
  actionText: { fontSize: SIZES.fontMd, color: COLORS.danger, ...FONTS.bold },
});

export default ManageUsersScreen;
