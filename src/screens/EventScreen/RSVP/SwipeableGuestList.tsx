import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import AvatarInitials from 'src/component/AvatarInitials';
import { COLORS } from 'src/utils/constants';
import { fontScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import IMAGES from '@images/index';
import { Image } from 'react-native';
import { fontFamily } from 'src/utils/functions';


const StatusButton = ({ status }) => {
    const camelCaseStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return (
        <TouchableOpacity style={{ padding: 8, borderRadius: 100, backgroundColor: status == 'CONFIRMED' ? COLORS.bgGreen : COLORS.bgRed }}>
            <Text style={{ color: status == 'CONFIRMED' ? COLORS.success : COLORS.errorText, fontSize: 14, fontFamily: fontFamily.ABCDiatype_Medium }}>{camelCaseStatus}</Text>
        </TouchableOpacity>
    );
}
const SwapDeleteComponent = ({ guest }) => {
    return (
        <View style={styles.swapList}>
            <View style={styles.avatarList}>
                <AvatarInitials name={guest?.firstName + ' ' + guest.lastName} size={48} />
                <Text style={styles.name}>{guest?.firstName} {guest.lastName}</Text>
            </View>
            {guest?.guestStatus && <StatusButton status={guest?.guestStatus} />}
        </View>
    );
};

export const SwipeableGuestList = ({ guest, onDelete, onInfoClick }) => {
    const translateX = useSharedValue(0);
    const [toggled, setToggled] = useState(false);
    const [isSwiping, setIsSwiping] = useState(false);


    const handleDelete = (e) => {
        runOnJS(onDelete)({ id: guest.id, type: e });
        runOnJS(setToggled)(false);
        translateX.value = withSpring(0);
    };
    const handleInfoClick = () => {
        runOnJS(onInfoClick)();
        runOnJS(setToggled)(false);
        translateX.value = withSpring(0);
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10]) // Ensures minor horizontal movements don't interfere
        .simultaneousWithExternalGesture() // Allows swipe & scroll to work together
        .onUpdate((event) => {
            if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
                translateX.value = event.translationX;
            }
        })
        .onEnd(() => {
            if (translateX.value < -50) {
                translateX.value = withTiming(-80, { duration: 50 });
                runOnJS(setToggled)(true);
            } else {
                translateX.value = withSpring(0);
                runOnJS(setToggled)(false);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={styles.guestContainer}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.swapDeletecontainer, animatedStyle]} hitSlop={{ top: 10, bottom: 10 }}>
                    <SwapDeleteComponent guest={guest} />
                </Animated.View>
            </GestureDetector>
            {toggled && (
                guest?.guestStatus === "DECLINED" ?
                    <TouchableOpacity style={styles.deleteButton} onPress={handleInfoClick}>
                        <View style={styles.iconBox}>
                            <Image source={IMAGES.info} style={{ width: 15, height: 15,resizeMode:'contain' }} />
                        </View>
                        <Text style={styles.deleteText}>Information</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.deleteButton} onPress={() => guest?.guestStatus ? handleDelete('server') : handleDelete('local')}>
                        <View style={styles.iconBox}>
                            <Image source={IMAGES.trash} style={{ width: 15, height: 15,resizeMode:'contain' }} />
                        </View>
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    guestContainer: {
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: verticalScale(1),
        borderColor: COLORS.borderGray,
        borderRadius: radiusScale(16),
        backgroundColor: COLORS.white,
        width: 72
    },
    deleteText: {
        fontSize: 11,
        marginTop: 4,
        fontFamily: fontFamily.ABCDiatype_Medium,
    },
    swapDeletecontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: verticalScale(1),
        borderColor: COLORS.borderGray,
        borderRadius: radiusScale(16),
        padding: verticalMarginScale(12),
        backgroundColor: COLORS.white,
    },
    name: {
        fontSize: fontScale(14),
        color: COLORS.black,
    },
    iconBox: { width: 40, height: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lighter_gray, borderRadius: 100 },
    swapList: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'space-between', flex: 1 },
    avatarList: { flexDirection: 'row', gap: 12, alignItems: 'center' }
});