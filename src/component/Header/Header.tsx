import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Image} from 'react-native';
import {Wp, Hp} from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import {COLORS} from '../../utils/constants';
import ProgressBar from '../ProgressBar/ProgressBar';
import {fontFamily} from '../..//utils/functions';

interface HeaderProps {
  onPress: () => void;
  headerTitle?: string;
   showProgressBar?:boolean
}

const Header: React.FC<HeaderProps> = ({
  onPress,
  headerTitle,
  showProgressBar=true
}) => {
  return (
    <View style={{}}>
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity onPress={onPress}>
          <View style={styles.iconWrapper}>
            <Image source={IMAGES.leftArrow} />
          </View>
        </TouchableOpacity>

        {/* Header Title */}
       { headerTitle &&  <Text style={styles.headerTitle}>{headerTitle}</Text>}
      </View>
     { showProgressBar &&  <ProgressBar />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Wp(5),
    marginTop: Hp(2),
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.tabBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Shadow on Android
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  headerTitle: {
    width:"77%",
    fontSize: 24,
    color: COLORS.black,
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign:"center",
  },
});

export default Header;
