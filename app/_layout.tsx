import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Slot, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/lib/auth';
import { useState } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Hide splash screen after resources are loaded
    SplashScreen.hideAsync().then(() => {
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (loading || !isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (session && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth screens
      router.replace('/(app)');
    }
  }, [session, loading, segments, isReady]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
