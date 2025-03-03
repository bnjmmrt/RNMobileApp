import React, { useEffect, useState } from "react";
import ButtonSmall from "../ButtonSmall";
import { StyleSheet, Text } from "react-native";
import AvatarInitials from "../AvatarInitials";
import { View } from "react-native-animatable";
import IMAGES from "../../assets/images";
import { COLORS } from "../../utils/constants";
import { fontFamily, numberSpacing } from "../../utils/functions";
import { useRequestMemberMutation } from "../../redux/actions/referralApiAction";
import { fontScale, horizontalMarginScale, horizontalScale, verticalMarginScale } from "src/utils/dimensions";
import { useVouchRequestMutation } from "src/redux/actions/rspvApiAction";

export const RenderMemberList = (data: any) => {
    const { item, eventId } = data;

    const [isSent, setIsSent] = useState(item?.isSent);
    const [vouchRequest, { isLoading, isSuccess: VouchSuccess, isError: VouchError }] = useVouchRequestMutation();

    const [requestMember, { isLoading: isRequestLoading, isSuccess, isError }] = useRequestMemberMutation();
    useEffect(() => {
        if (isSuccess || VouchSuccess || VouchError) {
            setIsSent(true);
        }
    }, [isSuccess, VouchSuccess, VouchError]);


    const handleRequestSent = async () => {
        try {
            const response = eventId ? await vouchRequest({ eventId, userId: item.userId }).unwrap() : await requestMember({ userId: item.userId }).unwrap();
            console.log("API Response:", response);
        } catch (error) {
            console.error("API Error:", error);
        } finally {
        }
    };

    return (
        <View style={styles.listItem}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <AvatarInitials name={item?.firstName + ' ' + item?.lastName} size={48} />
                <View style={{ width: horizontalScale(206) }}>
                    <Text numberOfLines={1} style={styles.name}>{item?.firstName} {item?.lastName}</Text>
                    <Text style={styles.phone}>{numberSpacing(item.phoneNumber, item.countryCode)}</Text>

                </View>
            </View>
            <ButtonSmall
                disabled={isSent}
                style={styles.smallBtnStyle}
                title={isSent ? "Request" : "Request"}
                colorTheme={isSent ? "dark" : "dark"}
                borderType={isSent ? "STRIPE" : "SOLID"}
                leftIcon={isSent ? IMAGES.check : null}
                onPress={handleRequestSent}
                loading={isLoading || isRequestLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    smallBtnStyle: {
        paddingHorizontal: horizontalMarginScale(12),
        paddingVertical: verticalMarginScale(8),
        borderRadius: 100,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: horizontalMarginScale(12),
        paddingVertical: verticalMarginScale(12),
        borderWidth: 1,
        borderColor: COLORS.borderGray,
        borderRadius: 16,
    },
    name: {
        fontSize: fontScale(14),
        fontFamily: fontFamily.ABCDiatype_Regular,
        color: COLORS.black
    },
    phone: {
        fontSize: fontScale(12),
        color: COLORS.light_gray,
        marginTop: verticalMarginScale(4),
        fontFamily: fontFamily.ABCDiatype_Regular,
    },
});
