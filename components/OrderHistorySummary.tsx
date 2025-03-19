import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Database } from '@/types/supabase';

type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'delivered';

type OrderHistory = Database['public']['Tables']['orders']['Row'] & {
  status_history: Array<{
    action: string;
    created_at: string;
  }>;
  status: OrderStatus;
};

type OrderHistorySummaryProps = {
  orders: OrderHistory[];
};

type StatItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number;
  color: string;
};

export default function OrderHistorySummary({ orders }: OrderHistorySummaryProps) {
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const rejectedOrders = orders.filter(order => order.status === 'rejected').length;

  const stats: StatItem[] = [
    {
      icon: 'receipt-long',
      label: 'Total de Pedidos',
      value: totalOrders,
      color: '#1976d2',
    },
    {
      icon: 'attach-money',
      label: 'Valor Total',
      value: `R$ ${totalAmount.toFixed(2)}`,
      color: '#4caf50',
    },
    {
      icon: 'check-circle',
      label: 'Entregues',
      value: deliveredOrders,
      color: '#388e3c',
    },
    {
      icon: 'cancel',
      label: 'Recusados',
      value: rejectedOrders,
      color: '#d32f2f',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
              <MaterialIcons name={stat.icon} size={24} color={stat.color} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
}); 