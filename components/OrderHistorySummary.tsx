import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

type OrderHistorySummaryProps = {
  orders: Order[];
};

export default function OrderHistorySummary({ orders }: OrderHistorySummaryProps) {
  const totalDelivered = orders.filter(order => order.status === 'delivered').length;
  const totalRejected = orders.filter(order => order.status === 'rejected').length;
  const totalAmount = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="check-circle" size={24} color="#4caf50" />
        <View style={styles.cardContent}>
          <Text style={styles.cardValue}>{totalDelivered}</Text>
          <Text style={styles.cardLabel}>Entregues</Text>
        </View>
      </View>

      <View style={styles.card}>
        <MaterialIcons name="cancel" size={24} color="#f44336" />
        <View style={styles.cardContent}>
          <Text style={styles.cardValue}>{totalRejected}</Text>
          <Text style={styles.cardLabel}>Recusados</Text>
        </View>
      </View>

      <View style={styles.card}>
        <MaterialIcons name="attach-money" size={24} color="#2196f3" />
        <View style={styles.cardContent}>
          <Text style={styles.cardValue}>R$ {totalAmount.toFixed(2)}</Text>
          <Text style={styles.cardLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cardContent: {
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
  },
}); 