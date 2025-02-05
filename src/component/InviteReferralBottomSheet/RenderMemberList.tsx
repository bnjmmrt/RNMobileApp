import React, { useEffect, useState } from "react";
import ButtonSmall from "../ButtonSmall";
import { StyleSheet, Text } from "react-native";
import AvatarInitials from "../AvatarInitials";
import { View } from "react-native-animatable";
import IMAGES from "../../assets/images";
import { COLORS } from "../../utils/constants";
import { fontFamily } from "../../utils/functions";
import { useRequestMemberMutation } from "../../redux/actions/referralApiAction";
import { fontScale, horizontalMarginScale, verticalMarginScale } from "src/utils/dimensions";

export const RenderMemberList = (data: any) => {
    const { item } = data;

    const [isSent, setIsSent] = useState(false);
    const [requestMember, { isLoading, isSuccess, isError }] = useRequestMemberMutation();
    useEffect(() => {
        if (isSuccess) {
            setIsSent(true);
        }
    }, [isSuccess]);


    const handleRequestSent = async () => {
        try {
            const response = await requestMember({ userId: item.userId }).unwrap();
            console.log("API Response:", response);
        } catch (error) {
            console.error("API Error:", error);
        } finally {
        }
    };

    return (
        <View style={styles.listItem}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <AvatarInitials name={item.name} size={48} />
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.phone}>{item.phoneNumber}</Text>
                </View>
            </View>
            <ButtonSmall
                disabled={isSent}
                style={styles.smallBtnStyle}
                title={isSent ? "Sent" : "Request"}
                colorTheme={isSent ? "dark" : "dark"}
                borderType={isSent ? "STRIPE" : "SOLID"}
                leftIcon={isSent ? IMAGES.check : null}
                onPress={handleRequestSent}
                loading={isLoading}
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
