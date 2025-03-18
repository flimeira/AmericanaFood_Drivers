import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ExpoRoot } from 'expo-router';

export default function App() {
  const colorScheme = useColorScheme();

  return <ExpoRoot context={require.context('./app')} />;
} 