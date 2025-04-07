import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import {
  Wp,
  Hp,
  verticalMarginScale,
  horizontalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import { COLORS } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import BtnBack from '../../assets/svgs/icons/BtnBack.svg'

const BackButton = ({ onPress }: { onPress: () => void }) => {
  const { goBack } = useNavigation();
  return (
    <TouchableOpacity style={styles.container} onPress={goBack}>
      <BtnBack height={40} width={40} />
      {/* <View style={styles.iconWrapper}>
        <Image source={IMAGES.leftArrow} />
      </View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: horizontalMarginScale(20),
    marginVertical: verticalMarginScale(16),
  },
  iconWrapper: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: 20,
    backgroundColor: COLORS.tabBorderColor, // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 2, // Add shadow for better appearance on Android
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
});

export default BackButton;
