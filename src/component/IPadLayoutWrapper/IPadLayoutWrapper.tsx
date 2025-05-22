import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { isIPad } from '../../utils/isTabletConfig';

interface IPadLayoutWrapperProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

const IPadLayoutWrapper: React.FC<IPadLayoutWrapperProps> = ({
  leftContent,
  rightContent,
}) => {
  if (!isIPad) {
    return <>{leftContent}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>{leftContent}</View>
      <View style={styles.rightContainer}>{rightContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
  },
  leftContainer: {
    width: 427,
    paddingTop: 36,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderGray,
  },
  rightContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
});

export default IPadLayoutWrapper;
