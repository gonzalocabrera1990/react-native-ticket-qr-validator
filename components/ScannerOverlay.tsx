import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const innerDimension = 260;

export default function ScannerOverlay() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Semi-transparent masks around the scan area */}
      <View style={[styles.mask, styles.topMask]} />
      <View style={styles.middleRow}>
        <View style={[styles.mask, styles.sideMask]} />
        <View style={styles.focusedArea}>
          {/* Corner borders for the scanner window */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <View style={[styles.mask, styles.sideMask]} />
      </View>
      <View style={[styles.mask, styles.bottomMask]} />
    </View>
  );
}

const styles = StyleSheet.create({
  mask: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  topMask: {
    flex: 1,
  },
  middleRow: {
    height: innerDimension,
    flexDirection: 'row',
  },
  sideMask: {
    flex: 1,
  },
  bottomMask: {
    flex: 1,
  },
  focusedArea: {
    width: innerDimension,
    height: innerDimension,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#6366f1', // Indigo 500
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
});
