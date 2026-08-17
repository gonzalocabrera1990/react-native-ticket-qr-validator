import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useSession } from '../../context/auth';
import { qrApi } from '../../services/api';
import ScannerOverlay from '../../components/ScannerOverlay';
import ResultView from '../../components/ResultView';
import { X, ScanLine } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';

export default function ScannerScreen() {
  const { mode } = useLocalSearchParams<{ mode: 'check_in' | 'read_only' }>();
  const selectedMode = mode || 'check_in';
  
  const [permission, requestPermission] = useCameraPermissions();
  const { signOut } = useSession();
  const isFocused = useIsFocused();
  
  // Estados para el flujo de escaneo
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para el resultado
  const [resultStatus, setResultStatus] = useState<'success' | 'error' | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [resultSubMessage, setResultSubMessage] = useState('');

  // Temporizador para limpiar el estado del escaneo
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resultStatus) {
      timer = setTimeout(() => {
        handleReset();
      }, 4000); 
    }
    return () => clearTimeout(timer);
  }, [resultStatus]);

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Necesitamos acceso a la cámara para escanear los códigos QR.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Otorgar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);

    try {
      // Llamada al endpoint /api/validar-qr/ con el modo seleccionado
      const response = await qrApi.validarQR(data, selectedMode);

      // Si llega aquí con status 200/201 (Axios default)
      setResultStatus('success');
      setResultMessage(response.data.mensaje || 'Acceso Permitido');
      setResultSubMessage(response.data.detalle || `Sector: ${response.data.sector || 'General'}`);
      
      // Haptic Feedback: Éxito (Vibración suave)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    } catch (error: any) {
      setResultStatus('error');
      
      // Manejo de errores (400, 401, 403, 404, etc.)
      const errorMsg = error.response?.data?.mensaje || 'Error de Validación';
      const subErrorMsg = error.response?.data?.detalle || error.response?.data?.razon || 'El código no es válido o ya fue usado.';
      
      setResultMessage(errorMsg);
      setResultSubMessage(subErrorMsg);

      // Haptic Feedback: Error (Vibración intermitente/fuerte)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResultStatus(null);
    setResultMessage('');
    setResultSubMessage('');
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <ScanLine size={24} color="#6366f1" />
          <Text style={styles.headerTitle}>Acceso QR</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton} activeOpacity={0.7}>
          <X size={20} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {isFocused && (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
        )}
        
        {/* Banner de Modo flotante */}
        <View style={[styles.modeBanner, selectedMode === 'read_only' ? styles.bannerReadOnly : styles.bannerCheckIn]}>
          <View style={styles.modeIndicatorDot} />
          <Text style={styles.modeBannerText}>
            {selectedMode === 'read_only' ? 'Modo: Solo Lectura' : 'Modo: Acceso Definitivo'}
          </Text>
        </View>

        {/* Guía visual sobre la cámara */}
        <ScannerOverlay />

        {/* Loading Indicator al procesar ticket */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Validando Ticket...</Text>
          </View>
        )}
      </View>

      {/* Instrucciones */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Coloca el código QR dentro del recuadro central para validar
        </Text>
      </View>

      {/* Pantallas completas de resultado */}
      {resultStatus && (
        <ResultView
          status={resultStatus}
          message={resultMessage}
          subMessage={resultSubMessage}
          onClose={handleReset}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  header: {
    height: 100,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#f8fafc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modeBanner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  bannerCheckIn: {
    backgroundColor: 'rgba(5, 150, 105, 0.95)', // Emerald 600
    borderWidth: 1,
    borderColor: '#34d399',
  },
  bannerReadOnly: {
    backgroundColor: 'rgba(2, 132, 199, 0.95)', // Sky 600
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  modeBannerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  modeIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
});
