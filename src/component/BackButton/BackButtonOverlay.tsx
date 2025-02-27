import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image, ViewStyle } from 'react-native';
import { Wp, Hp } from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import { COLORS } from '../../utils/constants';

const BackButtonOverlay = ({ onPress, customStyle, imageSource }: { onPress: () => void, customStyle?: ViewStyle, imageSource?: any }) => {
  const containerStyle = [styles.container, customStyle];
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Image source={imageSource || IMAGES.leftArrow} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Wp(4),
    position: 'absolute',
    marginTop: Hp(1),
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgBackArrow, // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Add shadow for better appearance on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default BackButtonOverlay;
