import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/student/HomeScreen';
import ResourcesScreen from '../screens/student/ResourcesScreen';
import UploadScreen from '../screens/student/UploadScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import AdminNavigator from './AdminNavigator';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Wrap tabs + admin in a stack so profile can navigate to admin
const StudentTabNavigator = () => {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.brandOrange,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarLabelStyle: {
          fontSize: SIZES.fontXs,
          ...FONTS.semibold,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.cardBorder,
          borderTopWidth: 1,
          height: 60,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Resources':
              iconName = focused ? 'library' : 'library-outline';
              break;
            case 'Upload':
              iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
              break;
            case 'AdminTab':
              iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      {isAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminNavigator}
          options={{ title: 'Admin' }}
        />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const StudentNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={StudentTabNavigator} />
    </Stack.Navigator>
  );
};

export default StudentNavigator;
