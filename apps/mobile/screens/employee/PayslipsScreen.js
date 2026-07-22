import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function PayslipsScreen() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      const response = await axios.get(`${API_URL}/payroll/my-payslips`);
      setPayslips(response.data);
    } catch (error) {
      console.error('Error fetching payslips:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPayslipItem = ({ item }) => (
    <TouchableOpacity style={styles.payslipItem}>
      <View style={styles.payslipHeader}>
        <Text style={styles.payslipMonth}>{item.month}</Text>
        <Text style={styles.payslipYear}>{item.year}</Text>
      </View>
      <View style={styles.payslipDetails}>
        <Text style={styles.payslipLabel}>Gross: KES {item.grossSalary?.toLocaleString()}</Text>
        <Text style={styles.payslipLabel}>Net: KES {item.netSalary?.toLocaleString()}</Text>
        <Text style={styles.payslipLabel}>Deductions: KES {(item.grossSalary - item.netSalary)?.toLocaleString()}</Text>
      </View>
      <View style={styles.payslipFooter}>
        <Text style={styles.viewText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Payslips</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={payslips}
          renderItem={renderPayslipItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No payslips found</Text>
            </View>
          }
        />
      )}
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
  listContent: {
    padding: 16,
  },
  payslipItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payslipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  payslipMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  payslipYear: {
    fontSize: 14,
    color: '#64748b',
  },
  payslipDetails: {
    marginBottom: 12,
  },
  payslipLabel: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  payslipFooter: {
    alignItems: 'flex-end',
  },
  viewText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
});
