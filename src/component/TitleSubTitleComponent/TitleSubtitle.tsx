import React from 'react';
import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Hp, Wp } from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';

interface TitleSubtitleProps {
    title: string;
    subTitle?: string; // Made optional
    centerTextAlign?: boolean; // Made optional
    titleFontSize?: number,
    subTitleMargin?: number,
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
    titleFontSize = 32,
    subTitleMargin = Hp(2),
    style, // Destructure style prop
    titleTextstyle,
    subTitleTextstyle

}) => {
    return (
        <View style={[styles.contentContainer, style]}>
            <Text
                style={[
                    styles.title,
                    {
                        textAlign: centerTextAlign ? 'center' : 'left',
                        color: isDarkTheme ? COLORS.white : COLORS.black,
                        fontSize: titleFontSize 
                    },
                    titleTextstyle
                ]}
            >
                {title}
            </Text>
            {subTitle ? (
                <Text
                    style={[
                        styles.subtitle,
                        {
                             textAlign: centerTextAlign ? 'center' : 'left' ,
                             marginVertical: subTitleMargin

                        },
                        subTitleTextstyle
                    ]}
                >
                    {subTitle}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontFamily: fontFamily.RomieTrial_Bold,
    },
    subtitle: {
        color: COLORS.light_gray,
        fontSize: 13,
        fontFamily: fontFamily.ABCDiatype_Regular,
        marginVertical: Hp(2),
    },
    contentContainer: {
        flexDirection: 'column',
        width:Wp(90)
    },
});

export default TitleSubtitle;
