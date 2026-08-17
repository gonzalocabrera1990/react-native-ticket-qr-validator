import { Stack } from 'expo-router';
import { SessionProvider } from '../context/auth';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(app)" />
      </Stack>
    </SessionProvider>
  );
}
