import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/hooks/useAuth';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Erro', error.message);
      } else {
        // Salvar credenciais para autenticação biométrica
        await AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }));
        router.replace('/(app)');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const credentials = await AsyncStorage.getItem('userCredentials');
      if (!credentials) {
        Alert.alert('Erro', 'Nenhuma credencial salva encontrada');
        return;
      }

      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticação biométrica',
        fallbackLabel: 'Usar senha',
        disableDeviceFallback: false,
      });

      if (success) {
        const { email, password } = JSON.parse(credentials);
        setLoading(true);
        const { error } = await signIn(email, password);
        
        if (error) {
          Alert.alert('Erro', error.message);
        } else {
          router.replace('/(app)');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons 
          name="delivery-dining" 
          size={80} 
          color="#f4511e" 
          style={styles.logo}
        />
        <ThemedText type="title" style={styles.title}>AmericanaFood</ThemedText>
        <ThemedText style={styles.subtitle}>Entregadores</ThemedText>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <MaterialIcons 
              name={showPassword ? "visibility-off" : "visibility"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </ThemedText>
        </TouchableOpacity>

        {biometricAvailable && (
          <TouchableOpacity 
            style={styles.biometricButton}
            onPress={handleBiometricAuth}
          >
            <MaterialIcons 
              name={Platform.OS === 'ios' ? 'face' : 'fingerprint'} 
              size={24} 
              color="#666" 
            />
            <ThemedText style={styles.biometricText}>
              Entrar com {Platform.OS === 'ios' ? 'Face ID' : 'Biometria'}
            </ThemedText>
          </TouchableOpacity>
        )}

        <View style={styles.links}>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.link}>Criar conta</ThemedText>
            </TouchableOpacity>
          </Link>
          
          <Link href="/forgot-password" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.link}>Esqueceu a senha?</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    padding: 8,
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginTop: 8,
  },
  biometricText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  link: {
    color: '#f4511e',
    fontSize: 14,
  },
}); 