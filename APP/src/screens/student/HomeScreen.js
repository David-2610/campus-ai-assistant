import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { getCategoryColor, formatDate } from '../../utils/helpers';
import api from '../../api/api';

const HomeScreen = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [viewedNotices, setViewedNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setError('');
      const { data } = await api.get('/notifications');
      setNotices(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotices();
  }, []);

  const handleTrackView = async (id) => {
    if (viewedNotices.includes(id)) return;
    try {
      await api.patch(`/notifications/${id}/view`);
      setViewedNotices(prev => [...prev, id]);
      setNotices(prev =>
        prev.map(n => (n._id === id ? { ...n, views: (n.views || 0) + 1 } : n))
      );
    } catch (err) {
      // Silently fail view tracking
    }
  };

  const renderNotice = ({ item: notice }) => {
    const catColor = getCategoryColor(notice.category);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleTrackView(notice._id)}
        style={styles.noticeCard}
      >
        {notice.imageUrl && (
          <Image source={{ uri: notice.imageUrl }} style={styles.noticeImage} resizeMode="cover" />
        )}
        <View style={styles.noticeBody}>
          <View style={styles.noticeHeader}>
            <Text style={styles.noticeTitle} numberOfLines={2}>{notice.title}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: catColor.bg }]}>
              <Text style={[styles.categoryText, { color: catColor.text }]}>
                {notice.category?.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.noticeContent} numberOfLines={4}>
            {notice.content}
          </Text>

          <View style={styles.tagRow}>
            {notice.targetBranch && (
              <View style={styles.tag}>
                <Text style={styles.tagLabel}>Branch:</Text>
                <Text style={styles.tagValue}>{notice.targetBranch}</Text>
              </View>
            )}
            {notice.targetYear && (
              <View style={styles.tag}>
                <Text style={styles.tagLabel}>Year:</Text>
                <Text style={styles.tagValue}>{notice.targetYear}</Text>
              </View>
            )}
            {notice.expiresAt && (
              <View style={[styles.tag, styles.expiryTag]}>
                <Ionicons name="time-outline" size={12} color={COLORS.brandOrange} />
                <Text style={styles.expiryText}>Exp: {formatDate(notice.expiresAt)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.noticeFooter}>
          <Text style={styles.footerText}>Posted {formatDate(notice.createdAt)}</Text>
          <View style={styles.viewsContainer}>
            <Ionicons name="eye-outline" size={14} color={COLORS.gray500} />
            <Text style={styles.viewsText}>{notice.views || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ScreenWrapper scrollable={false}>
        <LoadingSpinner />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Campus Notice Board</Text>
        <Text style={styles.pageSubtitle}>Stay updated with the latest announcements</Text>
      </View>

      <ErrorBanner message={error} style={{ marginHorizontal: 16 }} />

      <FlatList
        data={notices}
        renderItem={renderNotice}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.brandOrange]}
            tintColor={COLORS.brandOrange}
          />
        }
        ListEmptyComponent={
          !error && (
            <EmptyState
              emoji="📭"
              title="No new notices"
              subtitle="You're all caught up! Check back later."
            />
          )
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: SIZES.fontXxl,
    color: COLORS.brandDark,
    ...FONTS.bold,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.gray500,
  },
  list: {
    padding: 16,
    paddingTop: 8,
    gap: 16,
  },
  noticeCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  noticeImage: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.brandLight,
  },
  noticeBody: {
    padding: 16,
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  noticeTitle: {
    flex: 1,
    fontSize: SIZES.fontLg,
    color: COLORS.brandDark,
    ...FONTS.bold,
    lineHeight: 24,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  categoryText: {
    fontSize: SIZES.fontXs,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  noticeContent: {
    fontSize: SIZES.fontMd,
    color: COLORS.gray700,
    lineHeight: 22,
    marginBottom: 14,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: SIZES.radiusSm,
    gap: 4,
  },
  tagLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.gray600,
    ...FONTS.semibold,
  },
  tagValue: {
    fontSize: SIZES.fontSm,
    color: COLORS.brandMaroon,
    ...FONTS.medium,
  },
  expiryTag: {
    marginLeft: 'auto',
  },
  expiryText: {
    fontSize: SIZES.fontSm,
    color: COLORS.brandOrange,
    ...FONTS.semibold,
  },
  noticeFooter: {
    backgroundColor: 'rgba(255, 245, 240, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.fontXs,
    color: COLORS.gray500,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: SIZES.fontXs,
    color: COLORS.gray500,
    ...FONTS.semibold,
  },
});

export default HomeScreen;
