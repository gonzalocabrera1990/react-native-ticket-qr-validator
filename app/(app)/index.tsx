import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '../../context/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, QrCode, Server, CheckCircle2, Users, Database, Clock, ShieldCheck, Eye } from 'lucide-react-native';

export default function DashboardScreen() {
  const { username, signOut } = useSession();
  const router = useRouter();

  // Fecha actual formateada en español
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('es-ES', options);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {username ? username.substring(0, 2).toUpperCase() : 'OP'}
              </Text>
            </View>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Bienvenido,</Text>
              <Text style={styles.userNameText}>{username?.split('@')[0] || 'Operador'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton} activeOpacity={0.7}>
            <LogOut size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Date Container */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
        </View>

        {/* Modos de Escaneo */}
        <Text style={styles.sectionTitle}>Modos de Escaneo</Text>
        
        <View style={styles.scanButtonsContainer}>
          {/* Botón 1: Control de Acceso (Validar y Quemar) */}
          <TouchableOpacity 
            style={[styles.scannerCard, styles.checkInCard]} 
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/scanner', params: { mode: 'check_in' } })}
          >
            <View style={styles.scannerIconContainer}>
              <ShieldCheck size={36} color="#ffffff" />
            </View>
            <Text style={styles.scannerCardTitle}>Control de Acceso</Text>
            <Text style={styles.scannerCardModeSub}>Validar y Quemar</Text>
            <Text style={styles.scannerCardSubtitle}>
              Escanea y marca el ticket como usado en la base de datos de forma definitiva.
            </Text>
          </TouchableOpacity>

          {/* Botón 2: Control de Pista / Filtro (Solo Validar) */}
          <TouchableOpacity 
            style={[styles.scannerCard, styles.readOnlyCard]} 
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/scanner', params: { mode: 'read_only' } })}
          >
            <View style={styles.scannerIconContainer}>
              <Eye size={36} color="#ffffff" />
            </View>
            <Text style={styles.scannerCardTitle}>Control de Pista / Filtro</Text>
            <Text style={styles.scannerCardModeSubReadOnly}>Solo Validar</Text>
            <Text style={styles.scannerCardSubtitle}>
              Valida si el ticket existe y corresponde al evento, sin marcarlo como usado.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Statistics & Server Info Section */}
        <Text style={styles.sectionTitle}>Estado & Estadísticas</Text>
        
        <View style={styles.statsGrid}>
          {/* Card 1: Tickets Escaneados */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <CheckCircle2 size={22} color="#6366f1" />
            </View>
            <Text style={styles.statLabel}>Tickets Escaneados</Text>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statSubText}>En esta sesión</Text>
          </View>

          {/* Card 2: Server Status */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
              <Server size={22} color="#22c55e" />
            </View>
            <Text style={styles.statLabel}>Estado del Servidor</Text>
            <View style={styles.serverStatusContainer}>
              <View style={styles.activeDot} />
              <Text style={[styles.statValue, { fontSize: 18, marginTop: 0 }]}>Conectado</Text>
            </View>
            <Text style={styles.statSubText}>API Sincronizada</Text>
          </View>
        </View>

        {/* Additional Info / Operations Details */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Database size={18} color="#94a3b8" />
            <Text style={styles.infoLabel}>Base de Datos:</Text>
            <Text style={styles.infoValue}>Producción (Django)</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Clock size={18} color="#94a3b8" />
            <Text style={styles.infoLabel}>Última Conexión:</Text>
            <Text style={styles.infoValue}>Hace un momento</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Users size={18} color="#94a3b8" />
            <Text style={styles.infoLabel}>Rol:</Text>
            <Text style={styles.infoValue}>Control de Accesos</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Ticketera QR Acceso • V1.1 • Modo Ahorro de Batería Activo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1', // Indigo 500
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  welcomeTextContainer: {
    display: "flex",
    justifyContent: 'center',
    flexDirection: "column",
  },
  welcomeText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  userNameText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  dateContainer: {
    marginBottom: 28,
  },
  dateText: {
    color: '#64748b',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  scanButtonsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  checkInCard: {
    backgroundColor: '#059669', // Emerald 600
    shadowColor: '#10b981',
  },
  readOnlyCard: {
    backgroundColor: '#0284c7', // Sky 600
    shadowColor: '#38bdf8',
  },
  scannerCard: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  scannerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  scannerCardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  scannerCardModeSub: {
    color: '#a7f3d0', // Light green
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  scannerCardModeSubReadOnly: {
    color: '#bae6fd', // Light blue
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  scannerCardSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 18,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b', // Slate 800
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  serverStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  statSubText: {
    color: '#475569',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#131b2e', // Custom dark blue/slate tone
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#1e293b',
  },
  footerNote: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },
});
