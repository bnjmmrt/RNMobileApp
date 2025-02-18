import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
    fontScale,
    horizontalMarginScale,
    radiusScale,
    verticalMarginScale,
    verticalScale,
} from 'src/utils/dimensions';

const SelectReason = ({ list, handleSelect }: any) => {
    return (
        <View style={styles.container}>
            {list.map(item => {
                return (
                    <TouchableOpacity
                        key={item.id.toString()}
                        style={styles.button}
                        onPress={() => handleSelect(item)}>
                        <Text style={styles.buttonText}>{item.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: horizontalMarginScale(12),
    },
    button: {
        borderWidth: verticalScale(1),
        borderColor: COLORS.lighter_gray,
        borderRadius: radiusScale(25),
        backgroundColor: COLORS.white,
        marginTop: verticalMarginScale(5),
    },
    buttonText: {
        fontSize: fontScale(14),
        color: COLORS.black,
        textAlign: 'center',
        padding: verticalScale(14),
        lineHeight: verticalScale(16),
    },
});
export default SelectReason;;
