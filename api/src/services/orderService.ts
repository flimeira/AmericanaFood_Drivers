import { supabaseDrivers, supabaseRestaurants } from '../config/supabase';

export class OrderService {
  async updateOrderStatus(orderId: string, status: string) {
    try {
      // Atualiza na primeira base (drivers)
      const { error: error1 } = await supabaseDrivers
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error1) {
        console.error('Erro ao atualizar status na base drivers:', error1);
        throw error1;
      }

      // Atualiza na segunda base (restaurants)
      const { error: error2 } = await supabaseRestaurants
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error2) {
        console.error('Erro ao atualizar status na base restaurants:', error2);
        throw error2;
      }

      return { success: true };
    } catch (error) {
      console.error('Erro no serviço de pedidos:', error);
      throw error;
    }
  }
} 