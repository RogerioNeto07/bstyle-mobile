import { useEffect } from 'react';
import { useFonts, InriaSerif_400Regular, InriaSerif_700Bold } from '@expo-google-fonts/inria-serif';
import { SplashScreen, Stack } from 'expo-router';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'InriaSerif-Regular': InriaSerif_400Regular,
    'InriaSerif-Bold': InriaSerif_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-pan' as any);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/cadastro" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="produto/[id]" />
      <Stack.Screen name="vendedor/[nome]" />
      <Stack.Screen name="meus-produtos" />
      <Stack.Screen name="novo-produto" />
    </Stack>
  );
}