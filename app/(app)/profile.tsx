import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  birth_date: Date;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export default function ProfileScreen() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: '',
    name: '',
    cpf: '',
    phone: '',
    birth_date: new Date(),
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Erro', 'Usuário não encontrado');
        return;
      }

      console.log('Buscando perfil para o usuário:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        if (error.code === 'PGRST116') {
          // Perfil não encontrado, criar um novo
          console.log('Criando novo perfil para o usuário:', user.id);
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: '',
              cpf: '',
              phone: '',
              birth_date: new Date().toISOString(),
              cep: '',
              address: '',
              number: '',
              complement: '',
              neighborhood: '',
              city: '',
              state: '',
            });

          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
            throw insertError;
          }
        } else {
          throw error;
        }
      }

      if (data) {
        console.log('Dados do perfil encontrados:', data);
        setProfile({
          id: data.id,
          name: data.name || '',
          cpf: data.cpf || '',
          phone: data.phone || '',
          birth_date: data.birth_date ? new Date(data.birth_date) : new Date(),
          cep: data.cep || '',
          address: data.address || '',
          number: data.number || '',
          complement: data.complement || '',
          neighborhood: data.neighborhood || '',
          city: data.city || '',
          state: data.state || '',
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Erro', 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCepChange = async (cep: string) => {
    if (cep.length === 8) {
      try {
        console.log('Buscando CEP:', cep);
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        console.log('Dados do CEP:', data);

        if (!data.erro) {
          setProfile(prev => ({
            ...prev,
            cep,
            address: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          }));
        } else {
          Alert.alert('Erro', 'CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        Alert.alert('Erro', 'Erro ao buscar CEP');
      }
    }
  };

  const validateCPF = (cpf: string): boolean => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica CPFs com números iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const handleSave = async () => {
    try {
      // Validação do CPF
      if (!validateCPF(profile.cpf)) {
        Alert.alert('Erro', 'CPF inválido. Por favor, verifique o número informado.');
        return;
      }

      setLoading(true);
      console.log('Salvando perfil:', profile);
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          cpf: profile.cpf.replace(/[^\d]/g, ''), // Remove caracteres não numéricos antes de salvar
          phone: profile.phone,
          birth_date: profile.birth_date.toISOString(),
          cep: profile.cep,
          address: profile.address,
          number: profile.number,
          complement: profile.complement,
          neighborhood: profile.neighborhood,
          city: profile.city,
          state: profile.state,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) {
        console.error('Erro ao salvar perfil:', error);
        throw error;
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Erro', 'Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <ThemedText type="title" style={styles.cardTitle}>Dados Pessoais</ThemedText>
          
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={profile.name}
              onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="badge" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="CPF"
              value={profile.cpf}
              onChangeText={(text) => setProfile(prev => ({ ...prev, cpf: text }))}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="phone" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={profile.phone}
              onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="event" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Data de nascimento"
              value={profile.birth_date.toLocaleDateString()}
              editable={false}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <ThemedText type="title" style={styles.cardTitle}>Endereço</ThemedText>
          
          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="CEP"
              value={profile.cep}
              onChangeText={handleCepChange}
              keyboardType="numeric"
              maxLength={8}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="place" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Logradouro"
              value={profile.address}
              onChangeText={(text) => setProfile(prev => ({ ...prev, address: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="home" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Número"
              value={profile.number}
              onChangeText={(text) => setProfile(prev => ({ ...prev, number: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="apartment" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Complemento"
              value={profile.complement}
              onChangeText={(text) => setProfile(prev => ({ ...prev, complement: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="location-city" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Bairro"
              value={profile.neighborhood}
              onChangeText={(text) => setProfile(prev => ({ ...prev, neighborhood: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="location-city" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Cidade"
              value={profile.city}
              onChangeText={(text) => setProfile(prev => ({ ...prev, city: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="map" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Estado"
              value={profile.state}
              onChangeText={(text) => setProfile(prev => ({ ...prev, state: text }))}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <ThemedText style={styles.buttonText}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </ThemedText>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={profile.birth_date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setProfile(prev => ({ ...prev, birth_date: selectedDate }));
            }
          }}
          maximumDate={new Date()}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#f4511e',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
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
  button: {
    backgroundColor: '#f4511e',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 