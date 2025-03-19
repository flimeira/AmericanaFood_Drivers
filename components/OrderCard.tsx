import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onViewRoute: (order: Order) => void;
}

export default function OrderCard({ order, onStatusChange, onViewRoute }: OrderCardProps) {
  const router = useRouter();

  React.useEffect(() => {
    console.log('OrderCard montado com pedido:', order);
    console.log('Endereço do pedido:', order.customer_address);
  }, [order]);

  const handleAccept = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'accepted' })
        .eq('id', order.id);

      if (error) throw error;
      onStatusChange(order.id, 'accepted');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aceitar o pedido');
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'rejected' })
        .eq('id', order.id);

      if (error) throw error;
      onStatusChange(order.id, 'rejected');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível recusar o pedido');
    }
  };

  const handleDeliver = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', order.id);

      if (error) throw error;
      onStatusChange(order.id, 'delivered');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar o pedido como entregue');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
    switch (status) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Pedido #{order.order_number}</Text>
        <Text style={styles.restaurantName}>{order.restaurant_name}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
          <Text style={styles.statusText}>{translateStatus(order.status)}</Text>
        </View>

        <Text style={styles.address}>{order.customer_address}</Text>
        <Text style={styles.total}>Total: R$ {order.total_amount.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        {order.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={handleAccept}
            >
              <MaterialIcons name="check" size={24} color="#fff" />
              <Text style={styles.buttonText}>Aceitar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
              <Text style={styles.buttonText}>Recusar</Text>
            </TouchableOpacity>
          </>
        )}

        {order.status === 'accepted' && (
          <TouchableOpacity
            style={[styles.button, styles.deliverButton]}
            onPress={handleDeliver}
          >
            <MaterialIcons name="local-shipping" size={24} color="#fff" />
            <Text style={styles.buttonText}>Entregar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.routeButton]}
          onPress={() => {
            if (!order.customer_address) {
              Alert.alert('Erro', 'Endereço não encontrado para este pedido');
              return;
            }
            console.log('Botão Ver Rota clicado');
            console.log('Pedido:', JSON.stringify(order, null, 2));
            console.log('Endereço:', order.customer_address);
            onViewRoute(order);
          }}
        >
          <MaterialIcons name="directions" size={24} color="#fff" />
          <Text style={styles.buttonText}>Ver Rota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  address: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    gap: 4,
  },
  acceptButton: {
    backgroundColor: '#388e3c',
  },
  rejectButton: {
    backgroundColor: '#d32f2f',
  },
  deliverButton: {
    backgroundColor: '#1976d2',
  },
  routeButton: {
    backgroundColor: '#ffa000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
}); 