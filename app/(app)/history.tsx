import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import OrderHistoryCard from '@/components/OrderHistoryCard';
import OrderHistoryFilter from '@/components/OrderHistoryFilter';

type OrderHistory = Database['public']['Tables']['orders']['Row'] & {
  status_history: Array<{
    action: string;
    created_at: string;
  }>;
};

export default function HistoryScreen() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: null as string | null,
    restaurant: null as string | null,
    month: null as Date | null,
  });

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      let query = supabase
        .from('orders')
        .select(`
          *,
          status_history:order_history(
            action,
            created_at
          )
        `)
        .eq('user_id', user.id);

      // Aplicar filtros
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.restaurant) {
        query = query.eq('restaurant_name', filters.restaurant);
      }

      if (filters.month) {
        const startOfMonth = new Date(filters.month.getFullYear(), filters.month.getMonth(), 1);
        const endOfMonth = new Date(filters.month.getFullYear(), filters.month.getMonth() + 1, 0);
        query = query
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());
      }

      // Ordenar por data de criação (mais recente primeiro)
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Extrair restaurantes únicos para o filtro
      const uniqueRestaurants = Array.from(new Set(data.map(order => order.restaurant_name)));
      setRestaurants(uniqueRestaurants);

      // Processar os dados para agrupar por order_id
      const processedOrders = data.reduce((acc: OrderHistory[], order) => {
        const existingOrder = acc.find(o => o.id === order.id);
        if (existingOrder) {
          existingOrder.status_history.push(...order.status_history);
        } else {
          acc.push(order);
        }
        return acc;
      }, []);

      // Ordenar o histórico de status por data
      processedOrders.forEach(order => {
        order.status_history.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      setOrders(processedOrders);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [filters]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrderHistory();
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="hourglass-empty" size={48} color="#666" />
        <Text style={styles.emptyText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OrderHistoryFilter 
        onFilterChange={handleFilterChange}
        restaurants={restaurants}
      />
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderHistoryCard
            order={item}
            statusHistory={item.status_history}
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
            <MaterialIcons name="history" size={48} color="#666" />
            <Text style={styles.emptyText}>
              {filters.status || filters.restaurant || filters.month
                ? 'Nenhum pedido encontrado com os filtros atuais'
                : 'Nenhum pedido no histórico'}
            </Text>
          </View>
        }
      />
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
    textAlign: 'center',
  },
}); 