import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function ReportsScreen() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/metrics`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Team Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{reports?.totalEmployees || 0}</Text>
              <Text style={styles.summaryLabel}>Total Employees</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{reports?.attendanceRate || 0}%</Text>
              <Text style={styles.summaryLabel}>Attendance Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>Leave Overview</Text>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Pending Requests:</Text>
            <Text style={styles.reportValue}>{reports?.leaveUtilization || 0}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Utilization Rate:</Text>
            <Text style={styles.reportValue}>{reports?.leaveUtilization || 0}%</Text>
          </View>
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>Performance</Text>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Average Score:</Text>
            <Text style={styles.reportValue}>{reports?.performanceScore || 0}/5</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Turnover Rate:</Text>
            <Text style={styles.reportValue}>{reports?.turnoverRate || 0}%</Text>
          </View>
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>Payroll Summary</Text>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Total Cost:</Text>
            <Text style={styles.reportValue}>
              KES {reports?.payrollCost?.toLocaleString() || 0}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reportLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  reportValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
});
