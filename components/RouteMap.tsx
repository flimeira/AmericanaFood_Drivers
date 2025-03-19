import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAA4wk1Op-HAAogsMiC6Gu566CCYiYoWNQ'; // Substitua pela sua chave da API do Google Maps

interface RouteMapProps {
  destinationAddress: string;
  onClose: () => void;
}

export default function RouteMap({ destinationAddress, onClose }: RouteMapProps) {
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('RouteMap montado com endereço:', destinationAddress);
    if (!destinationAddress) {
      setError('Endereço de destino não fornecido');
      setLoading(false);
      return;
    }
    getLocation();
  }, [destinationAddress]);

  const getLocation = async () => {
    try {
      console.log('Verificando permissões de localização...');
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      console.log('Status atual da permissão:', existingStatus);

      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        console.log('Solicitando permissão de localização...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
        console.log('Novo status da permissão:', status);
      }

      if (finalStatus !== 'granted') {
        setError('Permissão para acessar a localização foi negada');
        setLoading(false);
        return;
      }

      console.log('Obtendo localização atual...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log('Localização obtida:', location);

      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log('Geocodificando endereço de destino:', destinationAddress);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          destinationAddress
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      console.log('Resposta da API de geocodificação:', JSON.stringify(data, null, 2));

      if (data.status === 'OK' && data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setDestination({
          latitude: lat,
          longitude: lng,
        });
        console.log('Coordenadas de destino definidas:', { lat, lng });
      } else {
        setError(`Não foi possível encontrar o endereço: ${destinationAddress}`);
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      setError('Erro ao obter localização. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getLocation();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Carregando rota...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Obtendo sua localização...</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Erro</Text>
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!origin || !destination) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Erro</Text>
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
          <Text style={styles.errorText}>Não foi possível carregar a rota</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  console.log('Renderizando mapa com:', { origin, destination });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Rota de Entrega</Text>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          ...origin,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={origin}
          title="Sua localização"
          pinColor="#1976d2"
        />
        <Marker
          coordinate={destination}
          title="Endereço de entrega"
          pinColor="#d32f2f"
        />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={3}
          strokeColor="#1976d2"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1976d2',
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#757575',
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 