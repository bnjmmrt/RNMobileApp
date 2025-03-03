import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, View, StyleSheet, Text, Image } from 'react-native';
import BottomSheetComponent from './BottomSheet';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, verticalScale, Wp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import Button from '../Button';
import moment from 'moment';
import { fontFamily, parseAndFormatDate } from 'src/utils/functions';
import IMAGES from '@images/index';
import DateTimePicker from 'react-native-ui-datepicker';
import { BottomSheetView } from '@gorhom/bottom-sheet';

interface Props {
    setSelectedDate: (date: string) => void;
    date: string;
}

const CustomDateTimePickerBottomSheet = forwardRef((props: Props, ref) => {
    const formatDate = (dateString: string) => {
        const date = moment(dateString, "YYYY-MM-DD HH:mm:ssZ", true);

        if (!date.isValid()) {
            return "Invalid Date";
        }

        return date.utc().format("YYYY-MM-DD HH:mm");
    };
    const myDate = formatDate(props.date);
    // const formattedMinDate = props?.minDate ? formatDate(props?.minDate) : undefined;


    const [selectedDate, setSelectedDate] = useState(myDate);


    return (
        <BottomSheetComponent
            ref={ref}
            snapPoints={[Platform.OS === 'ios' ? '82%' : '82%']}
            onClose={() => console.log(ref)}>
            <View style={styles.container}>
                <Text style={styles.title}>{"Date & Time"}</Text>
                <View>
                    <View style={[styles.pickerRow, {
                        marginTop: verticalMarginScale(30),
                    }]}>
                        <BottomSheetView style={styles.datePicker}>
                            <DateTimePicker
                                mode="single"
                                timePicker
                                minDate={props?.minDate || new Date()}
                                timePickerDecelerationRate={'fast'}
                                date={selectedDate.toString()}
                                headerButtonStyle={styles.headerButtonStyle}
                                headerContainerStyle={{ marginTop: 16 }}
                                headerTextStyle={{
                                    fontFamily: fontFamily.ABCDiatype_Regular,
                                    fontSize: fontScale(14),
                                }}
                                weekDaysTextStyle={{
                                    fontFamily: fontFamily.ABCDiatype_Bold,
                                    fontSize: fontScale(14),
                                }}
                                calendarTextStyle={{
                                    fontFamily: fontFamily.ABCDiatype_Regular,
                                    fontSize: fontScale(14),
                                }}
                                selectedItemColor={COLORS.black}
                                selectedRangeBackgroundColor="lightgray"
                                dayContainerStyle={styles.dayContainerStyle}
                                buttonNextIcon={<Image source={IMAGES.arrowRight} />}
                                buttonPrevIcon={
                                    <Image
                                        source={IMAGES.arrowRight}
                                        style={{ transform: [{ rotate: '180deg' }] }}
                                    />
                                }
                                onChange={({ date }) => {
                                    setSelectedDate(date)
                                }}
                            />
                        </BottomSheetView>

                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Button
                        style={styles.btnStyle}
                        title={"Save"}
                        colorTheme="dark"
                        onPress={() => {
                            props?.setSelectedDate(selectedDate)
                            ref?.current?.close();
                        }}
                    />
                    <Button
                        style={styles.btnStyle}
                        title={"Cancel"}
                        buttonType="stripe"
                        colorTheme="dark"
                        onPress={() => { ref?.current?.close(); }}
                    />
                </View>
            </View>
        </BottomSheetComponent>
    );
});

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: fontScale(32),
        fontFamily: fontFamily.RomieTrial_Bold,
        color: COLORS.black,
    },
    subTitle: {
        marginVertical: verticalMarginScale(10),
        fontSize: fontScale(14),
        color: COLORS.light_gray,
    },
    btnStyle: {
        borderRadius: radiusScale(100),
        marginTop: verticalMarginScale(10),
    },
    pickerRow: {
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        paddingHorizontal: 20
    },
    overlayStyle: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        transform: [{ translateY: -25 }],
    },
    dayContainerStyle: {
        width: 40,
        height: 40,
        marginHorizontal: 'auto',
    },
    alert: {
        color: COLORS.red,
    },
    headerButtonStyle: {
        backgroundColor: COLORS.tabBorderColor,
        borderRadius: radiusScale(100),
        height: verticalScale(24),
        width: verticalScale(24),
        justifyContent: 'center',
        alignItems: 'center',
    },
    datePicker: {
        borderRadius: radiusScale(12),
        borderColor: COLORS.borderGray,
        borderWidth: 1,
        paddingHorizontal: horizontalMarginScale(12),
    },
});

export default CustomDateTimePickerBottomSheet;
