import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {fontFamily, LINKS} from '../../utils/functions';
import {COLORS} from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {CustomText} from '../CustomText';

interface TermsAndPolicyProps {
  setUrl: (url: string) => void;
  type: string;
  showMessage: boolean;
}

const TermsAndPolicy: React.FC<TermsAndPolicyProps> = ({
  setUrl,
  type,
  showMessage,
}) => {
  const handleLinkPress = (url: string) => {
    setUrl(url); // Pass URL to parent
  };

  const terms = type == 'small' ? 'Terms' : 'Terms of Service';
  const privacy = type == 'small' ? 'Privacy' : 'Privacy Policy';
  const and = type == 'small' ? '&' : 'and';

  return (
    <View style={styles.container}>
      {showMessage && (
        <CustomText style={styles.text}>
          By clicking 'Next' you agree to our
        </CustomText>
      )}
      <View style={styles.linksContainer}>
        <TouchableOpacity
          onPress={() => handleLinkPress(LINKS.TERMS_AND_CONDITION)}>
          <CustomText style={styles.linkText}>{terms}</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.text}>{and} </CustomText>
        <TouchableOpacity onPress={() => handleLinkPress(LINKS.PRIVACY_POLICY)}>
          <CustomText style={styles.linkText}> {privacy}</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: verticalScale(8),
    alignItems: 'center',
    gap: verticalScale(4),
  },
  text: {
    fontSize: fontScale(12),
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: fontScale(12),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Bold,
    textDecorationLine: 'underline',
  },
});

export default TermsAndPolicy;
