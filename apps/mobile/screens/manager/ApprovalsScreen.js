import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function ApprovalsScreen() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const response = await axios.get(`${API_URL}/workflows/my-approvals`);
      setApprovals(response.data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.post(`${API_URL}/workflows/approvals/${selectedApproval.id}/approve`, {
        comment
      });
      setModalVisible(false);
      setSelectedApproval(null);
      setComment('');
      fetchApprovals();
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`${API_URL}/workflows/approvals/${selectedApproval.id}/reject`, {
        comment
      });
      setModalVisible(false);
      setSelectedApproval(null);
      setComment('');
      fetchApprovals();
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const renderApprovalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.approvalItem}
      onPress={() => {
        setSelectedApproval(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.approvalHeader}>
        <Text style={styles.approvalType}>{item.type}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.approvalTitle}>{item.title}</Text>
      <Text style={styles.approvalRequester}>Requested by: {item.requester}</Text>
      <Text style={styles.approvalDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#10b981';
      case 'REJECTED': return '#ef4444';
      case 'PENDING': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Approvals</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={approvals}
          renderItem={renderApprovalItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pending approvals</Text>
            </View>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Review Approval</Text>
            
            {selectedApproval && (
              <>
                <Text style={styles.approvalDetailType}>{selectedApproval.type}</Text>
                <Text style={styles.approvalDetailTitle}>{selectedApproval.title}</Text>
                <Text style={styles.approvalDetailDescription}>{selectedApproval.description}</Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Comment (Optional)</Text>
                  <View style={styles.input}>
                    <Text style={styles.inputText}>{comment || 'Add a comment...'}</Text>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.rejectButton]}
                    onPress={handleReject}
                  >
                    <Text style={styles.modalButtonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.approveButton]}
                    onPress={handleApprove}
                  >
                    <Text style={styles.modalButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  approvalItem: {
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
  approvalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  approvalType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  approvalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  approvalRequester: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 2,
  },
  approvalDate: {
    fontSize: 12,
    color: '#94a3b8',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  approvalDetailType: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  approvalDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  approvalDetailDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 20,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },
  inputText: {
    fontSize: 16,
    color: '#1e293b',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
    marginRight: 8,
  },
  approveButton: {
    backgroundColor: '#10b981',
    marginLeft: 8,
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
