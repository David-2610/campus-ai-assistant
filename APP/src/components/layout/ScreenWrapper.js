import React from 'react';
import { ScrollView, View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

const ScreenWrapper = ({ children, scrollable = true, style, contentStyle, padded = true }) => {
  const insets = useSafeAreaInsets();
  
  // We add explicit padding using the device's safe area insets 
  // plus a little extra buffer to prevent overlapping with status/nav bars
  const containerStyle = {
    paddingTop: insets.top + 12,
    paddingBottom: insets.bottom + 12,
  };

  return (
    <View style={[styles.safe, style, containerStyle]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            padded && styles.padded,
            contentStyle,
            { paddingBottom: 24 } // Extra scroll padding at bottom
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.view, padded && styles.padded, contentStyle]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.brandLight,
  },
  scroll: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
  padded: {
    padding: 16,
  },
});

export default ScreenWrapper;
