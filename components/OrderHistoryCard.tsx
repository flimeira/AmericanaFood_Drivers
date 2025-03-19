import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Database } from '@/types/supabase';

type OrderHistory = Database['public']['Tables']['orders']['Row'] & {
  status_history: Array<{
    action: string;
    created_at: string;
  }>;
  payment_method: string;
  delivery_address: string;
};

type OrderHistoryCardProps = {
  order: OrderHistory;
  statusHistory: Array<{
    action: string;
    created_at: string;
  }>;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#ffa000';
    case 'accepted':
      return '#1976d2';
    case 'delivered':
      return '#388e3c';
    case 'rejected':
      return '#d32f2f';
    default:
      return '#757575';
  }
};

const translateStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pendente';
    case 'accepted':
      return 'Aceito';
    case 'delivered':
      return 'Entregue';
    case 'rejected':
      return 'Recusado';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function OrderHistoryCard({ order, statusHistory }: OrderHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotateAnimation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(rotateAnimation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.orderNumber}>Pedido #{order.id}</Text>
            <Text style={styles.restaurantName}>{order.restaurant_name}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.totalAmount}>
              R$ {order.total_amount.toFixed(2)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{translateStatus(order.status)}</Text>
            </View>
          </View>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialIcons name="expand-more" size={24} color="#666" />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico de Status</Text>
            {statusHistory.map((status, index) => (
              <View key={index} style={styles.statusItem}>
                <View style={styles.statusDot} />
                <View style={styles.statusInfo}>
                  <Text style={styles.statusAction}>{status.action}</Text>
                  <Text style={styles.statusDate}>{formatDate(status.created_at)}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalhes do Pedido</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data do Pedido:</Text>
              <Text style={styles.detailValue}>{formatDate(order.created_at)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Forma de Pagamento:</Text>
              <Text style={styles.detailValue}>{order.payment_method}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Endereço de Entrega:</Text>
              <Text style={styles.detailValue}>{order.delivery_address}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1976d2',
    marginTop: 6,
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusAction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  statusDate: {
    fontSize: 12,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
}); 