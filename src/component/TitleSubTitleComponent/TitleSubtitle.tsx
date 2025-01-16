import React from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';
import { Hp, Wp } from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';

interface TitleSubtitleProps {
    title: string;
    subTitle?: string; // Made optional
    centerTextAlign?: boolean; // Made optional
    isDarkTheme?: boolean; // Made optional
    style?: ViewStyle; // Added style prop
}

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({
    title,
    subTitle = '', // Default to empty string
    centerTextAlign = false, // Default value set
    isDarkTheme = false, // Default value set
    style, // Destructure style prop

}) => {
    return (
        <View style={[styles.contentContainer, style]}>
            <Text
                style={[
                    styles.title,
                    {
                        textAlign: centerTextAlign ? 'center' : 'left',
                        color: isDarkTheme ? COLORS.white : COLORS.black,
                        fontSize: centerTextAlign ? 28 : 32
                    },
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
                             marginVertical: centerTextAlign ? Hp(1) : Hp(2)

                        },
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
