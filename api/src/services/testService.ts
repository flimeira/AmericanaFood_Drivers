import { supabaseDrivers, supabaseRestaurants } from '../config/supabase';

export class TestService {
  async testConnections() {
    try {
      // Testa conexão com a base de entregadores
      const { data: driversData, error: driversError } = await supabaseDrivers
        .from('orders')
        .select('count')
        .limit(1);

      if (driversError) {
        console.error('Erro na conexão com base de entregadores:', driversError);
        throw new Error(`Erro na base de entregadores: ${driversError.message}`);
      }

      // Testa conexão com a base de restaurantes
      const { data: restaurantsData, error: restaurantsError } = await supabaseRestaurants
        .from('orders')
        .select('count')
        .limit(1);

      if (restaurantsError) {
        console.error('Erro na conexão com base de restaurantes:', restaurantsError);
        throw new Error(`Erro na base de restaurantes: ${restaurantsError.message}`);
      }

      return {
        success: true,
        drivers: {
          connected: true,
          message: 'Conexão com base de entregadores estabelecida com sucesso'
        },
        restaurants: {
          connected: true,
          message: 'Conexão com base de restaurantes estabelecida com sucesso'
        }
      };
    } catch (error) {
      console.error('Erro no teste de conexões:', error);
      throw error;
    }
  }
} 