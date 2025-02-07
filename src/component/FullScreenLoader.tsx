import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface FullScreenLoaderProps {
  loading: boolean;
  children: React.ReactNode;
  customStyle?: any
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ loading, children, customStyle }) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
      {loading && (
        <View style={[styles.loaderContainer, customStyle]}>
          <ActivityIndicator size='small' color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default FullScreenLoader;
