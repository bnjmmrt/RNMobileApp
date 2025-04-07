import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Button from "src/component/Button";
import AddAnnouncementStyles from "./AddAnnouncement/AddAnnouncementStyles";
import { COLORS } from "src/utils/constants";
import IMAGES from "@images/index";

interface ticketTypeProps {
    eventData: any;
    selectedTicketType: any;
    toggleTicketType: (ticketType: any, index: number) => void;
    cancelClick: () => void;
    confirmTicketType: () => void;
}

export const TicketType: React.FC<ticketTypeProps> = ({ eventData, selectedTicketType, cancelClick, confirmTicketType, toggleTicketType }) => {
    const styles = AddAnnouncementStyles();
    return (
        <View>
            {eventData?.ticketTypes?.map((item: any, index: number) => {
                let isSelected = selectedTicketType.includes(item);
                return (
                    <TouchableOpacity
                        key={item.id.toString()}
                        style={[
                            styles.guestButton,
                            isSelected && {
                                borderWidth: 2,
                                borderColor: COLORS.black,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 12,
                            },
                        ]}
                        onPress={() => toggleTicketType(item, index)}>
                        {isSelected && (
                            <Image
                                source={IMAGES.check}
                                style={{ width: 16, height: 16, resizeMode: 'contain' }}
                            />
                        )}
                        <Text style={styles.guestButtonText}>{item.name}</Text>
                        {isSelected && <View />}
                    </TouchableOpacity>
                );
            })}
            <Button
                disabled={false}
                style={styles.btnStyle}
                title={'Confirm'}
                colorTheme="dark"
                onPress={confirmTicketType}
            />
            <Button
                disabled={false}
                style={styles.cancelbtnStyle}
                title={'Cancel'}
                colorTheme="light"
                onPress={cancelClick}
                clearButtonStyle={styles.clearButton}
                textStyle={{ color: '#000' }}
            />
        </View>
    );
}
