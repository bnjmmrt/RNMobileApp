import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { fontScale, Wp } from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { Image } from 'react-native-animatable';
import IMAGES from '../../assets/images';

interface MiddleStaticComponentProps {
  style?: ViewStyle; // Added style prop
  titleTextstyle?: TextStyle; // Added style prop
  subTitleTextstyle?: TextStyle; // Added style prop
}

const MiddleStaticComponent: React.FC<MiddleStaticComponentProps> = ({
  style,
  titleTextstyle,
  subTitleTextstyle,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const listItem = [
    LABLE.VERIFY_YOUR_INSTAGRAM,
    LABLE.REQUEST_REFERRAL_FROM_RUMOR,
    LABLE.INVITE_YOUR_FRIEND,
    BUTTON_LABLE.ENTER_REFERRAL_CODE,
  ];

  const renderListItem = (item: string, index: number) => {
    if (item === LABLE.VERIFY_YOUR_INSTAGRAM) {
      return (
        <View key={index} style={styles.listContainer}>
          <Image source={IMAGES.checkCircleFilled} style={styles.icon} />
          <Text style={[styles.subtitle, subTitleTextstyle]}>{item}</Text>
          <View>
            <TouchableOpacity onPress={() => setShowTooltip(!showTooltip)}>
              <Image
                source={IMAGES.info_filled}
                tintColor={COLORS.white}
                style={styles.infoIcon}
              />
            </TouchableOpacity>
            {showTooltip && (
              <View style={styles.customTooltip}>
                <View style={styles.tooltipArrow} />
                <Text style={styles.tooltipText}>
                  Send a direct message with{'\n'}the code:
                </Text>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeText}>RUMORAPP</Text>
                  <Text style={styles.tooltipText}>{' to '}</Text>
                  <Text
                    style={[
                      styles.tooltipText,
                      {
                        fontFamily: fontFamily.ABCDiatype_Bold,
                        fontSize: fontScale(11),
                      },
                    ]}>
                    @therumor
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      );
    }

    return (
      <View key={index} style={styles.listContainer}>
        <Image source={IMAGES.checkCircleFilled} style={styles.icon} />
        <Text style={[styles.subtitle, subTitleTextstyle]}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.contentContainer, style]}>
      <Text style={[styles.title, titleTextstyle]}>
        {LABLE.FASTRACK_YOUR_APPLICATION}
      </Text>
      {listItem.map((item, index) => renderListItem(item, index))}
    </View>
  );
};
//  paddingHorizontal: 20, marginTop: 20
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
    resizeMode: 'contain',
  },
  subtitle: {
    color: COLORS.light_text,
    fontSize: 13,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  contentContainer: {
    flexDirection: 'column',
    width: Wp(80),
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.dark_gray,
    backgroundColor: COLORS.black2,
  },
  listContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    marginStart: 10,
    marginBottom: 10,
  },
  infoIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginLeft: 8,
    opacity: 0.5,
  },
  customTooltip: {
    position: 'absolute',
    bottom: 35,
    right: -90,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: 171,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    left: '53%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  tooltipText: {
    color: '#666',
    fontSize: fontScale(11),
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  codeText: {
    color: COLORS.white,
    fontSize: fontScale(11),
    fontFamily: fontFamily.ABCDiatype_Medium,
    backgroundColor: COLORS.dark_gray,
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default MiddleStaticComponent;
