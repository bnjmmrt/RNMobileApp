import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Button from "src/component/Button";
import AddAnnouncementStyles from "./AddAnnouncement/AddAnnouncementStyles";
import { COLORS } from "src/utils/constants";
import IMAGES from "@images/index";

interface CollaboratorProps {
    collaborators: any[];
    selectedCollaborator: any[];
    toggleCollaborator: (collaborator: any, index: number) => void;
    cancelClick: () => void;
    confirmCollaborator: () => void;
}


export const Collaborator: React.FC<CollaboratorProps> = ({ collaborators, selectedCollaborator, toggleCollaborator, cancelClick, confirmCollaborator }) => {
    const styles = AddAnnouncementStyles();
    return (
        <View>
            {collaborators.map((item: any, index: number) => {
                let isSelected = selectedCollaborator.includes(item);
                const collabratorName = `${item?.companyName || item?.email} (${item?.role?.name
                    })`;

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
                        onPress={() => toggleCollaborator(item, index)}>
                        {isSelected && (
                            <Image
                                source={IMAGES.check}
                                resizeMode='contain'
                                style={{ width: 16, height: 16 }}
                            />
                        )}
                        <Text style={styles.guestButtonText}>{collabratorName}</Text>
                        {isSelected && <View />}
                    </TouchableOpacity>
                );
            })}
            <Button
                disabled={false}
                style={styles.btnStyle}
                title={'Confirm'}
                colorTheme="dark"
                onPress={confirmCollaborator}
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




