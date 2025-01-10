import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { Wp, Hp } from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import { COLORS } from '../../utils/constants';

const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Image source={IMAGES.leftArrow} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Wp(5),
    marginTop: Hp(2),
  },
  iconWrapper: {
    width: 40,
    height:40,
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

export default BackButton;
