import React from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {COLORS} from '../../utils/constants';
import {fontScale, verticalMarginScale} from '../../utils/dimensions';
import {fontFamily} from '../../utils/functions';
import {CustomText} from '../CustomText';

interface TitleSubtitleProps {
  title: string;
  subTitle?: string; // Made optional
  centerTextAlign?: boolean; // Made optional
  titleFontSize?: number;
  subTitleMargin?: number;
  isDarkTheme?: boolean; // Made optional
  style?: ViewStyle; // Added style prop
  titleTextstyle?: TextStyle; // Added style prop
  subTitleTextstyle?: TextStyle; // Added style prop
}

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({
  title,
  subTitle = '', // Default to empty string
  centerTextAlign = false, // Default value set
  isDarkTheme = false, // Default value
  titleFontSize = fontScale(32),
  subTitleMargin = verticalMarginScale(16),
  style, // Destructure style prop
  titleTextstyle,
  subTitleTextstyle,
}) => {
  return (
    <View style={[styles.contentContainer, style]}>
      <CustomText
        style={[
          styles.title,
          {
            textAlign: centerTextAlign ? 'center' : 'left',
            color: isDarkTheme ? COLORS.white : COLORS.black,
            fontSize: titleFontSize,
          },
          titleTextstyle,
        ]}>
        {title}
      </CustomText>

      {subTitle ? (
        <>
          <CustomText
            style={[
              styles.subtitle,
              {
                textAlign: centerTextAlign ? 'center' : 'left',
                marginVertical: subTitleMargin,
              },
              subTitleTextstyle,
            ]}>
            {subTitle}
          </CustomText>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
  },
  contentContainer: {
    flexDirection: 'column',
  },
});

export default TitleSubtitle;
