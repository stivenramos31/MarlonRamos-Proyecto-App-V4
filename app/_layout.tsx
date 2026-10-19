import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Este componente hijo reacciona a los cambios en el token
function RootLayoutNav() {
  const { token, isLoadingSession } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingSession) return; // Espera a que termine de leer AsyncStorage

    const inProtectedGroup = segments[0] === '(protected)';

    if (!token && inProtectedGroup) {
      // (public)/index.tsx es simplemente la raíz '/'
      router.replace('/'); 
    } else if (token && !inProtectedGroup) {
      // (protected)/dashboard.tsx es simplemente '/dashboard'
      // Le agregamos "as any" solo por si TypeScript no ha actualizado su tipado interno
      router.replace('/dashboard' as any); 
    }
  }, [token, isLoadingSession, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(public)' />
      <Stack.Screen name='(protected)' />
    </Stack>
  );
}

// Este es el layout principal
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}