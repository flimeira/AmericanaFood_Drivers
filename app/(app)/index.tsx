import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Modal, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import OrderCard from '@/components/OrderCard';
import RouteMap from '@/components/RouteMap';

type Order = Database['public']['Tables']['orders']['Row'];

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRouteMap, setShowRouteMap] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      console.log('Buscando pedidos para o usuário:', user.id);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'accepted'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Pedidos carregados:', data);
      if (data && data.length > 0) {
        console.log('Primeiro pedido:', data[0]);
        console.log('Endereço do primeiro pedido:', data[0].Customer_Address);
      }
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Busca inicial dos pedidos
    fetchOrders();

    // Configura o timer para atualizar a cada minuto
    const timer = setInterval(() => {
      console.log('Atualizando pedidos via timer...');
      fetchOrders();
    }, 60000); // 60000 ms = 1 minuto

    // Limpa o timer quando o componente é desmontado
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewRoute = (order: Order) => {
    console.log('Pedido selecionado para rota:', order);
    console.log('Endereço do pedido:', order.customer_address);
    if (!order.customer_address) {
      console.error('Endereço não encontrado no pedido');
      return;
    }
    setSelectedOrder(order);
    setShowRouteMap(true);
  };

  const handleCloseRouteMap = () => {
    setShowRouteMap(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="hourglass-empty" size={48} color="#666" />
        <Text style={styles.emptyText}>Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onStatusChange={handleStatusChange}
            onViewRoute={handleViewRoute}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1976d2']}
          />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <MaterialIcons name="receipt-long" size={48} color="#666" />
            <Text style={styles.emptyText}>Nenhum pedido disponível</Text>
          </View>
        }
      />

      <Modal
        visible={showRouteMap}
        animationType="slide"
        onRequestClose={handleCloseRouteMap}
      >
        {selectedOrder && selectedOrder.customer_address && (
          <RouteMap
            destinationAddress={selectedOrder.customer_address}
            onClose={handleCloseRouteMap}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
}); 