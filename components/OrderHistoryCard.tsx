import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

type OrderHistoryCardProps = {
  order: Order;
  statusHistory: Array<{
    action: string;
    created_at: string;
  }>;
};

export default function OrderHistoryCard({ order, statusHistory }: OrderHistoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      case 'accepted':
        return '#2196f3';
      default:
        return '#ffa000';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'check-circle';
      case 'rejected':
        return 'cancel';
      case 'accepted':
        return 'delivery-dining';
      default:
        return 'schedule';
    }
  };

  const isDelivered = order.status === 'delivered';
  const isRejected = order.status === 'rejected';

  return (
    <View style={[
      styles.container,
      isDelivered && styles.deliveredContainer,
      isRejected && styles.rejectedContainer
    ]}>
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Pedido #{order.id}</Text>
          {isDelivered && (
            <View style={styles.badge}>
              <MaterialIcons name="check" size={12} color="#4caf50" />
              <Text style={[styles.badgeText, { color: '#4caf50' }]}>Entregue</Text>
            </View>
          )}
          {isRejected && (
            <View style={styles.badge}>
              <MaterialIcons name="close" size={12} color="#f44336" />
              <Text style={[styles.badgeText, { color: '#f44336' }]}>Recusado</Text>
            </View>
          )}
        </View>
        <Text style={styles.restaurantName}>{order.restaurant_name}</Text>
        {!isRejected && (
          <Text style={styles.amount}>
            R$ {Number(order.total_amount).toFixed(2)}
          </Text>
        )}
      </View>

      <View style={styles.timeline}>
        {statusHistory.map((status, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <View style={[styles.timelineDot, { backgroundColor: getStatusColor(order.status) }]} />
              {index < statusHistory.length - 1 && (
                <View style={[styles.timelineLine, { backgroundColor: getStatusColor(order.status) }]} />
              )}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineAction}>{status.action}</Text>
              <Text style={styles.timelineDate}>{formatDate(status.created_at)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deliveredContainer: {
    borderColor: '#4caf50',
    borderWidth: 2,
    backgroundColor: '#f1f8e9',
  },
  rejectedContainer: {
    borderColor: '#f44336',
    borderWidth: 2,
    backgroundColor: '#ffebee',
  },
  header: {
    marginBottom: 16,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timeline: {
    marginTop: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196f3',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#2196f3',
    marginTop: 4,
    marginBottom: -12,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
    marginTop: -4,
  },
  timelineAction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#666',
  },
}); 