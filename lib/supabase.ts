import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import NetInfo from '@react-native-community/netinfo';
import { AuthError } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Configuração do cliente Supabase com opções otimizadas para Expo Go
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: {
      getItem: async (key) => {
        try {
          return await AsyncStorage.getItem(key);
        } catch (error) {
          console.error('Error getting item from storage:', error);
          return null;
        }
      },
      setItem: async (key, value) => {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting item in storage:', error);
        }
      },
      removeItem: async (key) => {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing item from storage:', error);
        }
      },
    },
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Função para verificar a conectividade
export const checkConnection = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    console.log('Network status:', netInfo);
    return netInfo.isConnected && netInfo.isInternetReachable;
  } catch (error) {
    console.error('Error checking connection:', error);
    return false;
  }
};

// Função para testar a conexão com o Supabase
export const testSupabaseConnection = async () => {
  try {
    // Tenta fazer uma requisição simples para a API do Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Accept': 'application/json',
      },
    });
    console.log('Supabase connection test:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return false;
  }
};

// Tipo genérico para respostas do Supabase
type SupabaseResponse<T = unknown> = {
  data: T | null;
  error: AuthError | null;
};

// Função para fazer requisições com retry
export const makeRequest = async <T>(
  requestFn: () => Promise<SupabaseResponse<T>>,
  maxRetries = 3
): Promise<SupabaseResponse<T>> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('Sem conexão com a internet');
      }
      
      console.log(`Attempting request (attempt ${i + 1}/${maxRetries})`);
      
      // Adiciona um pequeno delay antes de cada tentativa
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const result = await requestFn();
      
      if (result.error) {
        console.error('Request error:', result.error);
        throw result.error;
      }
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Request failed (attempt ${i + 1}/${maxRetries}):`, error);
      
      if (i < maxRetries - 1) {
        const delay = 1000 * (i + 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return { data: null, error: lastError as AuthError };
}; 