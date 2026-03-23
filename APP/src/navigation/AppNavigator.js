import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking stored auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <StudentNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brandLight,
  },
});

export default AppNavigator;
