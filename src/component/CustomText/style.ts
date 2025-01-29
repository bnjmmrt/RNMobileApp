import {StyleSheet} from 'react-native';
import {COLORS} from 'src/utils/constants';
import {fontFamily} from 'src/utils/functions';

export const styles = StyleSheet.create({
  customText: {
    color: COLORS.text,
    fontFamily: fontFamily.ABCDiatype_Regular,
    fontSize: 12,
  },
});
