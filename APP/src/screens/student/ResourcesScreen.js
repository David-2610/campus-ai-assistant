import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput, Linking, ScrollView, Modal, Image, ActivityIndicator, Alert, Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { formatDate } from '../../utils/helpers';
import api from '../../api/api';

const ResourcesScreen = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({
    type: '', subject: '', branch: '', semester: '', year: '', examType: '', search: '',
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({ branch: [], subject: [], type: [], examType: [] });
  const [showFilters, setShowFilters] = useState(false);
  
  // Viewer state
  const [viewerFile, setViewerFile] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [filters, pagination.page, sort]);

  const fetchMetadata = async () => {
    try {
      const { data } = await api.get('/metadata');
      setMetadata({
        branch: data.branch || [],
        subject: data.subject || [],
        type: data.type || [],
        examType: data.examType || [],
      });
    } catch (err) {
      // Silently fail — filters will just be empty
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: pagination.page, limit: pagination.limit, sort };
      if (filters.type) params.type = filters.type;
      if (filters.subject) params.subject = filters.subject;
      if (filters.branch) params.branch = filters.branch;
      if (filters.semester) params.semester = filters.semester;
      if (filters.year) params.year = filters.year;
      if (filters.examType) params.examType = filters.examType;
      if (filters.search) params.search = filters.search;

      const response = await api.get('/resources', { params });
      setResources(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleResetFilters = () => {
    setFilters({ type: '', subject: '', branch: '', semester: '', year: '', examType: '', search: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewResource = (item) => {
    if (item?.fileUrl) {
      setViewerFile({ url: item.fileUrl, name: item.title, extension: item.fileUrl.split('.').pop() });
    }
  };

  const handleNativeDownload = async () => {
    if (!viewerFile) return;
    try {
      setDownloading(true);
      const safeFilename = viewerFile.name.replace(/[^a-zA-Z0-9.\-_ \s]/g, '') || 'document';
      const extension = viewerFile.extension.split('?')[0] || 'pdf';
      const fullFilename = `${safeFilename}.${extension}`;
      const tempUri = `${FileSystem.cacheDirectory}${fullFilename}`;
      
      // Download temporarily
      const { uri } = await FileSystem.downloadAsync(viewerFile.url, tempUri);

      if (Platform.OS === 'android') {
        // Use Storage Access Framework on Android to pick a folder and save natively
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64Data = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          const createdFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri, 
            fullFilename,
            'application/octet-stream' // fallback MIME
          );
          await FileSystem.writeAsStringAsync(createdFileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
          Alert.alert('Download Complete', 'File successfully saved into your selected folder!');
        }
      } else {
        // iOS users use "Save to Files" safely inside the OS share overlay
        await Sharing.shareAsync(uri, { UTI: 'public.item', dialogTitle: `Save ${fullFilename}` });
      }
    } catch (err) {
      Alert.alert('Download Failed', 'Could not save the file to your device.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareResource = async () => {
    if (!viewerFile) return;
    try {
      setSharing(true);
      const safeFilename = viewerFile.name.replace(/[^a-zA-Z0-9.\-_ \s]/g, '') || 'document';
      const extension = viewerFile.extension.split('?')[0] || 'pdf';
      const tempUri = `${FileSystem.cacheDirectory}${safeFilename}.${extension}`;
      
      const { uri } = await FileSystem.downloadAsync(viewerFile.url, tempUri);
      await Sharing.shareAsync(uri, { dialogTitle: `Share ${safeFilename}` });
    } catch (err) {
      Alert.alert('Share Failed', 'Could not share the file.');
    } finally {
      setSharing(false);
    }
  };

  const FilterChip = ({ label, value, onClear }) => {
    if (!value) return null;
    return (
      <View style={styles.filterChip}>
        <Text style={styles.filterChipText}>{label}: {value}</Text>
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={16} color={COLORS.brandOrange} />
        </TouchableOpacity>
      </View>
    );
  };

  const FilterPicker = ({ label, options, selected, onSelect }) => (
    <View style={styles.filterItem}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
        <TouchableOpacity
          style={[styles.filterOption, !selected && styles.filterOptionActive]}
          onPress={() => onSelect('')}
        >
          <Text style={[styles.filterOptionText, !selected && styles.filterOptionTextActive]}>All</Text>
        </TouchableOpacity>
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : String(opt);
          const lbl = typeof opt === 'object' ? opt.value : String(opt);
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.filterOption, selected === val && styles.filterOptionActive]}
              onPress={() => {
                onSelect(val);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              <Text style={[styles.filterOptionText, selected === val && styles.filterOptionTextActive]}>
                {lbl}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderResource = ({ item }) => (
    <View style={styles.resourceCard}>
      <View style={styles.resourceHeader}>
        <View style={styles.resourceIcon}>
          <Ionicons name="document-text" size={24} color={COLORS.brandOrange} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.resourceTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.resourceMeta}>
            {item.type} • {item.branch} • Sem {item.semester}
          </Text>
        </View>
      </View>

      <View style={styles.resourceTags}>
        {item.subject && (
          <View style={styles.resourceTag}>
            <Text style={styles.resourceTagText}>{item.subject}</Text>
          </View>
        )}
        {item.examType && (
          <View style={styles.resourceTag}>
            <Text style={styles.resourceTagText}>{item.examType}</Text>
          </View>
        )}
        {item.year && (
          <View style={styles.resourceTag}>
            <Text style={styles.resourceTagText}>{item.year}</Text>
          </View>
        )}
      </View>

      <View style={styles.resourceFooter}>
        <Text style={styles.resourceDate}>{formatDate(item.createdAt)}</Text>
        {item.fileUrl && (
          <TouchableOpacity style={styles.downloadBtn} onPress={() => handleViewResource(item)}>
            <Ionicons name="eye-outline" size={16} color={COLORS.white} />
            <Text style={styles.downloadBtnText}>View</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'search');

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Browse Resources</Text>
        <Text style={styles.pageSubtitle}>Explore educational materials shared by the community</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            placeholderTextColor={COLORS.gray400}
            value={filters.search}
            onChangeText={(v) => {
              setFilters(prev => ({ ...prev, search: v }));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          />
          {filters.search ? (
            <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, search: '' }))}>
              <Ionicons name="close-circle" size={18} color={COLORS.gray400} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color={showFilters ? COLORS.white : COLORS.brandOrange} />
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsRow}>
          {activeFilters.map(([key, val]) => (
            <FilterChip
              key={key}
              label={key}
              value={val}
              onClear={() => {
                setFilters(prev => ({ ...prev, [key]: '' }));
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            />
          ))}
          <TouchableOpacity onPress={handleResetFilters} style={styles.clearAllBtn}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Expandable Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <FilterPicker
            label="Type"
            options={metadata.type}
            selected={filters.type}
            onSelect={(v) => setFilters(prev => ({ ...prev, type: v }))}
          />
          <FilterPicker
            label="Branch"
            options={metadata.branch}
            selected={filters.branch}
            onSelect={(v) => setFilters(prev => ({ ...prev, branch: v }))}
          />
          <FilterPicker
            label="Subject"
            options={metadata.subject}
            selected={filters.subject}
            onSelect={(v) => setFilters(prev => ({ ...prev, subject: v }))}
          />
          <FilterPicker
            label="Exam Type"
            options={metadata.examType}
            selected={filters.examType}
            onSelect={(v) => setFilters(prev => ({ ...prev, examType: v }))}
          />
        </View>
      )}

      {/* Results Summary */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {pagination.total > 0
            ? `${((pagination.page - 1) * pagination.limit) + 1}–${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`
            : 'No resources found'}
        </Text>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => {
            setSort(prev => (prev === 'latest' ? 'oldest' : 'latest'));
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
        >
          <Ionicons name={sort === 'latest' ? 'arrow-down' : 'arrow-up'} size={14} color={COLORS.brandOrange} />
          <Text style={styles.sortText}>{sort === 'latest' ? 'Latest' : 'Oldest'}</Text>
        </TouchableOpacity>
      </View>

      <ErrorBanner message={error} style={{ marginHorizontal: 16 }} />

      {loading && !refreshing ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={resources}
          renderItem={renderResource}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.brandOrange]} />
          }
          ListEmptyComponent={
            !error && <EmptyState emoji="📚" title="No resources found" subtitle="Try adjusting your filters" />
          }
          ListFooterComponent={
            pagination.totalPages > 1 && (
              <View style={styles.paginationRow}>
                <TouchableOpacity
                  disabled={pagination.page === 1}
                  onPress={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  style={[styles.pageBtn, pagination.page === 1 && styles.pageBtnDisabled]}
                >
                  <Ionicons name="chevron-back" size={18} color={pagination.page === 1 ? COLORS.gray300 : COLORS.brandOrange} />
                </TouchableOpacity>
                <Text style={styles.pageText}>
                  Page {pagination.page} of {pagination.totalPages}
                </Text>
                <TouchableOpacity
                  disabled={pagination.page === pagination.totalPages}
                  onPress={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  style={[styles.pageBtn, pagination.page === pagination.totalPages && styles.pageBtnDisabled]}
                >
                  <Ionicons name="chevron-forward" size={18} color={pagination.page === pagination.totalPages ? COLORS.gray300 : COLORS.brandOrange} />
                </TouchableOpacity>
              </View>
            )
          }
        />
      )}

      {/* Internal Viewer Modal */}
      {viewerFile && (
        <Modal
          visible={!!viewerFile}
          animationType="slide"
          onRequestClose={() => setViewerFile(null)}
          presentationStyle="pageSheet"
        >
          <View style={styles.viewerContainer}>
            <View style={styles.viewerHeader}>
              <Text style={styles.viewerTitle} numberOfLines={1}>{viewerFile.name}</Text>
              <TouchableOpacity onPress={() => setViewerFile(null)} style={styles.viewerCloseBtn}>
                <Ionicons name="close" size={24} color={COLORS.brandDark} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, backgroundColor: COLORS.gray100 }}>
              {viewerFile.url.toLowerCase().match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                <Image 
                  source={{ uri: viewerFile.url }} 
                  style={{ flex: 1 }} 
                  resizeMode="contain" 
                />
              ) : (
                <WebView
                  source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(viewerFile.url)}` }}
                  style={{ flex: 1 }}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={styles.viewerLoader}>
                      <ActivityIndicator size="large" color={COLORS.brandOrange} />
                      <Text style={{ marginTop: 10, color: COLORS.gray500 }}>Loading Document Viewer...</Text>
                    </View>
                  )}
                />
              )}
            </View>

            <View style={styles.viewerActionsRow}>
              <TouchableOpacity 
                onPress={handleShareResource} 
                disabled={sharing || downloading}
                style={[styles.viewerShareAction, sharing && { opacity: 0.7 }]}
              >
                {sharing ? <ActivityIndicator color={COLORS.brandMaroon} size="small" /> : <Ionicons name="share-social" size={20} color={COLORS.brandMaroon} />}
                <Text style={styles.viewerShareText}>
                  {sharing ? 'Loading...' : 'Share'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleNativeDownload} 
                disabled={downloading || sharing}
                style={[styles.viewerDownloadAction, downloading && { opacity: 0.7 }]}
              >
                {downloading ? <ActivityIndicator color={COLORS.white} size="small" /> : <Ionicons name="download" size={20} color={COLORS.white} />}
                <Text style={styles.viewerDownloadText}>
                  {downloading ? 'Downloading...' : 'Download'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: { padding: 16, paddingBottom: 4 },
  pageTitle: { fontSize: SIZES.fontXxl, color: COLORS.brandDark, ...FONTS.bold },
  pageSubtitle: { fontSize: SIZES.fontSm, color: COLORS.gray500, marginTop: 2 },
  // Search
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.inputBorder,
    paddingHorizontal: 12, height: 44, gap: 8,
  },
  searchInput: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.brandDark },
  filterToggle: {
    width: 44, height: 44, borderRadius: SIZES.radius, borderWidth: 1.5,
    borderColor: COLORS.brandOrange, justifyContent: 'center', alignItems: 'center',
  },
  filterToggleActive: { backgroundColor: COLORS.brandOrange },
  // Filter chips
  filterChipsRow: { paddingHorizontal: 16, marginBottom: 8, flexGrow: 0 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brandLight,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: SIZES.radiusFull,
    marginRight: 8, gap: 6, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  filterChipText: { fontSize: SIZES.fontXs, color: COLORS.brandMaroon, ...FONTS.semibold },
  clearAllBtn: { paddingHorizontal: 10, paddingVertical: 6, justifyContent: 'center' },
  clearAllText: { fontSize: SIZES.fontXs, color: COLORS.danger, ...FONTS.bold },
  // Filters
  filtersContainer: {
    backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: SIZES.radiusMd,
    padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  filterItem: { marginBottom: 10 },
  filterLabel: { fontSize: SIZES.fontSm, color: COLORS.brandDark, ...FONTS.semibold, marginBottom: 6 },
  filterOptions: { flexGrow: 0 },
  filterOption: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.gray100, marginRight: 6,
  },
  filterOptionActive: { backgroundColor: COLORS.brandOrange },
  filterOptionText: { fontSize: SIZES.fontSm, color: COLORS.gray700 },
  filterOptionTextActive: { color: COLORS.white, ...FONTS.bold },
  // Results
  resultsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 8,
  },
  resultsText: { fontSize: SIZES.fontSm, color: COLORS.gray600 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { fontSize: SIZES.fontSm, color: COLORS.brandOrange, ...FONTS.semibold },
  // List
  list: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  // Resource Card
  resourceCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, ...SHADOWS.sm,
  },
  resourceHeader: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  resourceIcon: {
    width: 44, height: 44, borderRadius: SIZES.radius, backgroundColor: COLORS.brandLight,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  resourceTitle: { fontSize: SIZES.fontBase, color: COLORS.brandDark, ...FONTS.bold, lineHeight: 22 },
  resourceMeta: { fontSize: SIZES.fontSm, color: COLORS.gray500, marginTop: 2 },
  resourceTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  resourceTag: {
    backgroundColor: COLORS.brandLight, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: SIZES.radiusFull, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  resourceTagText: { fontSize: SIZES.fontXs, color: COLORS.brandMaroon, ...FONTS.medium },
  resourceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resourceDate: { fontSize: SIZES.fontXs, color: COLORS.gray500 },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.brandOrange,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: SIZES.radiusSm,
  },
  downloadBtnText: { fontSize: SIZES.fontSm, color: COLORS.white, ...FONTS.semibold },
  // Pagination
  paginationRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 16, paddingVertical: 16,
  },
  pageBtn: {
    width: 36, height: 36, borderRadius: SIZES.radiusFull, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  pageBtnDisabled: { opacity: 0.4 },
  pageText: { fontSize: SIZES.fontMd, color: COLORS.brandDark, ...FONTS.semibold },
  // Viewer
  viewerContainer: { flex: 1, backgroundColor: COLORS.white },
  viewerHeader: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: COLORS.gray200,
    backgroundColor: COLORS.white 
  },
  viewerTitle: { flex: 1, fontSize: SIZES.fontLg, color: COLORS.brandDark, ...FONTS.bold, marginRight: 16 },
  viewerCloseBtn: { padding: 4, backgroundColor: COLORS.gray100, borderRadius: 20 },
  viewerLoader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  viewerActionsRow: {
    flexDirection: 'row', backgroundColor: COLORS.white, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 12,
    borderTopWidth: 1, borderTopColor: COLORS.gray200,
  },
  viewerShareAction: {
    flex: 1, flexDirection: 'row', backgroundColor: COLORS.brandLight, padding: 16, borderRadius: SIZES.radiusLg,
    justifyContent: 'center', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: COLORS.brandMaroon,
  },
  viewerShareText: { color: COLORS.brandMaroon, fontSize: SIZES.fontMd, ...FONTS.bold },
  viewerDownloadAction: { 
    flex: 2, flexDirection: 'row', backgroundColor: COLORS.brandMaroon, padding: 16, borderRadius: SIZES.radiusLg,
    justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  viewerDownloadText: { color: COLORS.white, fontSize: SIZES.fontMd, ...FONTS.bold },
});

export default ResourcesScreen;
