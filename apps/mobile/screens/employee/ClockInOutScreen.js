import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function ClockInOutScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchTodayAttendance();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    // In a real app, use geolocation API
    setLocation({ latitude: -1.2921, longitude: 36.8219 }); // Nairobi coordinates
  };

  const fetchTodayAttendance = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/today`);
      if (response.data && response.data.checkIn) {
        setIsClockedIn(true);
        setClockInTime(new Date(response.data.checkIn));
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/attendance/clock-in`, {
        location,
        timestamp: new Date().toISOString()
      });
      
      setIsClockedIn(true);
      setClockInTime(new Date());
      Alert.alert('Success', 'Clocked in successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clock in. Please try again.');
      console.error('Clock in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/attendance/clock-out`, {
        location,
        timestamp: new Date().toISOString()
      });
      
      setIsClockedIn(false);
      setClockInTime(null);
      Alert.alert('Success', 'Clocked out successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clock out. Please try again.');
      console.error('Clock out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Current Status</Text>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: isClockedIn ? '#10b981' : '#f59e0b' }
          ]}>
            <Text style={styles.statusText}>
              {isClockedIn ? 'Clocked In' : 'Clocked Out'}
            </Text>
          </View>
          
          {clockInTime && (
            <View style={styles.clockInInfo}>
              <Text style={styles.clockInLabel}>Clock In Time:</Text>
              <Text style={styles.clockInValue}>{formatTime(clockInTime)}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.clockButton,
            isClockedIn ? styles.clockOutButton : styles.clockInButton
          ]}
          onPress={isClockedIn ? handleClockOut : handleClockIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.clockButtonText}>
              {isClockedIn ? 'Clock Out' : 'Clock In'}
            </Text>
          )}
        </TouchableOpacity>

        {location && (
          <View style={styles.locationCard}>
            <Text style={styles.locationTitle}>Location</Text>
            <Text style={styles.locationText}>
              Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 24,
    alignItems: 'center',
  },
  dateText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusIndicator: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clockInInfo: {
    alignItems: 'center',
  },
  clockInLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  clockInValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  clockButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  clockInButton: {
    backgroundColor: '#10b981',
  },
  clockOutButton: {
    backgroundColor: '#ef4444',
  },
  clockButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#1e293b',
  },
});
