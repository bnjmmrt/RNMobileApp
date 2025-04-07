import {StyleSheet} from 'react-native';
import {COLORS} from 'src/utils/constants';
import {verticalMarginScale, Wp} from 'src/utils/dimensions';
import {fontFamily} from 'src/utils/functions';

export const styles = StyleSheet.create({
  actionContentWrapper: {
    marginHorizontal: Wp(5),
  },
  actionCta: {
    borderRadius: 99,
    backgroundColor: COLORS.errorText,
    marginBottom: verticalMarginScale(10),
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 16,
  },
  message: {
    textAlign: 'center',
    color: COLORS.light_gray,
    marginTop: 16,
    marginBottom: 24,
  },
});
