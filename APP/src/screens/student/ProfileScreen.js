import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Button from '../../components/ui/Button';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={COLORS.brandOrange} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        <View style={styles.roleBadge}>
          <Ionicons
            name={isAdmin ? 'shield-checkmark' : 'school'}
            size={14}
            color={isAdmin ? COLORS.brandOrange : COLORS.brandMaroon}
          />
          <Text style={[styles.roleText, isAdmin && { color: COLORS.brandOrange }]}>
            {user?.role?.toUpperCase() || 'STUDENT'}
          </Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Details</Text>
        <InfoRow icon="school-outline" label="Branch" value={user?.branch} />
        <InfoRow icon="calendar-outline" label="Semester" value={user?.semester ? `Semester ${user.semester}` : null} />
        <InfoRow icon="ribbon-outline" label="Batch" value={user?.graduationYear ? `Class of ${user.graduationYear}` : null} />
        <InfoRow icon="person-outline" label="Role" value={user?.role} />
        <InfoRow
          icon="checkmark-circle-outline"
          label="Status"
          value={user?.isActive !== false ? 'Active' : 'Suspended'}
        />
      </View>

      {/* Admin Quick Access */}
      {isAdmin && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin Panel</Text>
          <Text style={styles.cardSubtitle}>Quick access to management tools</Text>

          <View style={styles.adminGrid}>
            {[
              { label: 'Dashboard', icon: 'stats-chart', screen: 'AdminDashboard' },
              { label: 'Resources', icon: 'folder-open', screen: 'AdminResources' },
              { label: 'Notices', icon: 'megaphone', screen: 'AdminNotifications' },
              { label: 'Users', icon: 'people', screen: 'AdminUsers' },
              { label: 'Reports', icon: 'flag', screen: 'AdminReports' },
              { label: 'Metadata', icon: 'settings', screen: 'AdminMetadata' },
            ].map((item) => (
              <Button
                key={item.screen}
                title={item.label}
                variant="secondary"
                size="sm"
                icon={<Ionicons name={item.icon} size={16} color={COLORS.brandMaroon} />}
                onPress={() => navigation.navigate('AdminTab', { screen: item.screen })}
                style={styles.adminBtn}
                textStyle={{ fontSize: SIZES.fontSm, color: COLORS.brandMaroon }}
              />
            ))}
          </View>
        </View>
      )}

      {/* Logout */}
      <Button
        title="Logout"
        variant="danger"
        onPress={handleLogout}
        icon={<Ionicons name="log-out-outline" size={18} color={COLORS.white} />}
        style={styles.logoutBtn}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.brandMaroon,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: SIZES.fontXxxl,
    color: COLORS.white,
    ...FONTS.bold,
  },
  userName: {
    fontSize: SIZES.fontXl,
    color: COLORS.brandDark,
    ...FONTS.bold,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: SIZES.fontMd,
    color: COLORS.gray500,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.brandLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  roleText: {
    fontSize: SIZES.fontSm,
    color: COLORS.brandMaroon,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: SIZES.fontLg,
    color: COLORS.brandDark,
    ...FONTS.bold,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.gray500,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  infoLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.gray500,
    ...FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: SIZES.fontBase,
    color: COLORS.brandDark,
    ...FONTS.medium,
    marginTop: 2,
  },
  adminGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  adminBtn: {
    backgroundColor: COLORS.brandLight,
    borderColor: COLORS.cardBorder,
  },
  logoutBtn: {
    marginTop: 8,
    marginBottom: 32,
  },
});

export default ProfileScreen;
