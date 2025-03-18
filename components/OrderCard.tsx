import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

type OrderCardProps = {
  order: {
    id: string;
    order_number: string;
    Customer_Address: string;
    restaurant_name: string;
    total_amount: number;
    status: string;
  };
  onStatusChange: (orderId: string, newStatus: string) => void;
};

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const router = useRouter();

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

  const handleViewRoute = () => {
    // Aqui você pode implementar a navegação para a tela de rota
    // usando as coordenadas do endereço de entrega
    Alert.alert('Funcionalidade em desenvolvimento', 'Visualização de rota em breve');
  };

  // Debug para verificar os dados recebidos
  console.log('Order data:', order);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Pedido #{order.order_number}</Text>
        <Text style={styles.restaurant}>{order.restaurant_name}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.addressContainer}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <Text style={styles.address} numberOfLines={2}>
            {order.Customer_Address || 'Endereço não disponível'}
          </Text>
        </View>
        <Text style={styles.amount}>R$ {order.total_amount.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        {order.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={handleAccept}
            >
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Aceitar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
            >
              <MaterialIcons name="cancel" size={20} color="#fff" />
              <Text style={styles.buttonText}>Recusar</Text>
            </TouchableOpacity>
          </>
        )}
        
        {order.status === 'accepted' && (
          <TouchableOpacity
            style={[styles.button, styles.deliverButton]}
            onPress={handleDeliver}
          >
            <MaterialIcons name="local-shipping" size={20} color="#fff" />
            <Text style={styles.buttonText}>Entregue</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.routeButton]}
          onPress={handleViewRoute}
        >
          <MaterialIcons name="directions" size={20} color="#fff" />
          <Text style={styles.buttonText}>Ver Rota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
  restaurant: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    marginBottom: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  deliverButton: {
    backgroundColor: '#3498db',
  },
  routeButton: {
    backgroundColor: '#9b59b6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
}); 