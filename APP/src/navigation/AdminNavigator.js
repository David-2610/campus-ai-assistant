import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/admin/DashboardScreen';
import ManageResourcesScreen from '../screens/admin/ManageResourcesScreen';
import ManageNotificationsScreen from '../screens/admin/ManageNotificationsScreen';
import ManageUsersScreen from '../screens/admin/ManageUsersScreen';
import ManageReportsScreen from '../screens/admin/ManageReportsScreen';
import ManageMetadataScreen from '../screens/admin/ManageMetadataScreen';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.brandDark,
        headerTitleStyle: {
          ...FONTS.bold,
          fontSize: SIZES.fontLg,
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminResources"
        component={ManageResourcesScreen}
        options={{ title: 'Manage Resources', headerShown: false }}
      />
      <Stack.Screen
        name="AdminNotifications"
        component={ManageNotificationsScreen}
        options={{ title: 'Manage Notices', headerShown: false }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={ManageUsersScreen}
        options={{ title: 'User Management', headerShown: false }}
      />
      <Stack.Screen
        name="AdminReports"
        component={ManageReportsScreen}
        options={{ title: 'Reports', headerShown: false }}
      />
      <Stack.Screen
        name="AdminMetadata"
        component={ManageMetadataScreen}
        options={{ title: 'Metadata', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
