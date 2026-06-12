import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Employee Screens
import ClockInOutScreen from './screens/employee/ClockInOutScreen';
import LeaveRequestsScreen from './screens/employee/LeaveRequestsScreen';
import PayslipsScreen from './screens/employee/PayslipsScreen';
import AnnouncementsScreen from './screens/employee/AnnouncementsScreen';
import DocumentsScreen from './screens/employee/DocumentsScreen';
import TasksScreen from './screens/employee/TasksScreen';

// Manager Screens
import ApprovalsScreen from './screens/manager/ApprovalsScreen';
import TeamAttendanceScreen from './screens/manager/TeamAttendanceScreen';
import ReportsScreen from './screens/manager/ReportsScreen';

// Common Screens
import LoginScreen from './screens/common/LoginScreen';
import ProfileScreen from './screens/common/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function EmployeeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ClockInOut') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Leave') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Payslips') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (route.name === 'Documents') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen name="ClockInOut" component={ClockInOutScreen} options={{ title: 'Clock In/Out' }} />
      <Tab.Screen name="Leave" component={LeaveRequestsScreen} options={{ title: 'Leave Requests' }} />
      <Tab.Screen name="Payslips" component={PayslipsScreen} options={{ title: 'Payslips' }} />
      <Tab.Screen name="Announcements" component={AnnouncementsScreen} options={{ title: 'Announcements' }} />
      <Tab.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Documents' }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: 'Tasks' }} />
    </Tab.Navigator>
  );
}

function ManagerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Approvals') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'TeamAttendance') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen name="Approvals" component={ApprovalsScreen} options={{ title: 'Approvals' }} />
      <Tab.Screen name="TeamAttendance" component={TeamAttendanceScreen} options={{ title: 'Team Attendance' }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="EmployeeTabs" 
          component={EmployeeTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ManagerTabs" 
          component={ManagerTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
