import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import XCircleIcon from 'src/component/SVG/XCircleIcon';
import XIcon from 'src/component/SVG/XIcon';
import { COLORS } from 'src/utils/constants';
// Import your React Native icons - adjust the import path as needed

export default function useErrorBadge(clearTimer?: number) {
  const [error, setError] = React.useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const ErrorBadge = ({ children }: { children?: React.ReactNode }) => {
    if (!error) return null;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={clearError}
          style={styles.iconButton}
          activeOpacity={0.7}>
          <XCircleIcon style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {children}
        </View>
        <TouchableOpacity
          onPress={clearError}
          style={styles.cancelButton}
          activeOpacity={0.7}>
          <XIcon style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };

  const setErrorMessage = (message: string | null) => {
    if (message) {
      setError(message);
    } else {
      if (clearTimer) {
        setTimeout(() => {
          setError(null);
        }, clearTimer);
      }
    }
  };

  return {
    error,
    setErrorMessage,
    ErrorBadge,
    clearError,
  };
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 12,
    backgroundColor: COLORS.bgRed, // dangerBgLight equivalent
    padding: 12,
  },
  contentContainer: {
    // flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  iconButton: {
    padding: 2, // Small padding for better touch target
  },
  icon: {
    width: 14,
    height: 14,
    // You may need to adjust this based on your icon component
    // For SVG icons, you might need to use tintColor or fill
    tintColor: COLORS.errorText, // danger color equivalent
  },
  errorText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
    flex: 1,
  },
  cancelButton: {
    // position: 'absolute',
    // top: 8,
    // right: 8,
  },
});
