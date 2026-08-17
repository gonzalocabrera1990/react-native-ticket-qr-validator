import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="scanner" 
        options={{ 
          presentation: 'modal', 
          title: 'Escáner de QR',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
