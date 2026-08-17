import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react-native';

type ResultViewProps = {
  status: 'success' | 'error' | null;
  message: string;
  subMessage?: string;
  onClose: () => void;
};

export default function ResultView({ status, message, subMessage, onClose }: ResultViewProps) {
  useEffect(() => {
    if (status === 'success') {
      // Éxito: Vibración ligera
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
        Vibration.vibrate(200);
      });
    } else if (status === 'error') {
      // Error: Vibración persistente/error
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {
        Vibration.vibrate([100, 100, 100, 100, 100]); // 3 vibraciones cortas
      });
    }
  }, [status]);

  if (!status) return null;

  const isSuccess = status === 'success';

  return (
    <View style={[styles.container, isSuccess ? styles.successBg : styles.errorBg]}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          {isSuccess ? (
            <CheckCircle size={90} color="#22c55e" />
          ) : (
            <AlertTriangle size={90} color="#ef4444" />
          )}
        </View>

        <Text style={[styles.statusText, isSuccess ? styles.successText : styles.errorText]}>
          {isSuccess ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO'}
        </Text>

        <Text style={styles.messageText}>{message}</Text>
        
        {subMessage ? (
          <Text style={styles.subMessageText}>{subMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <RefreshCw size={20} color="#1e293b" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Volver a Escanear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 24,
  },
  successBg: {
    backgroundColor: '#052e16', // Dark green base
  },
  errorBg: {
    backgroundColor: '#450a0a', // Dark red base
  },
  card: {
    width: '100%',
    backgroundColor: '#0f172a', // Slate 900
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  statusText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#22c55e',
  },
  errorText: {
    color: '#ef4444',
  },
  messageText: {
    fontSize: 18,
    color: '#f8fafc',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  subMessageText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
  },
});
