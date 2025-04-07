import React, { useState } from "react";
import { ActivityIndicator, FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import AddAnnouncementStyles from "./AddAnnouncement/AddAnnouncementStyles";
import { ANNOUNCEMENT, COLORS, ERROR_MESSAGE } from "src/utils/constants";
import IMAGES from "@images/index";
import { radiusScale } from "src/utils/dimensions";
import { CustomText } from "src/component/CustomText";
import Input from "src/component/Input/Input";

interface AnnouncementDetailProps {
    announcementText: string;
    setAnnouncementText: (text: string) => void;
    refreshing: boolean;
    announcementRef: React.RefObject<any>;
    atachmentArr: any[];
    editPhotoClick: () => void;
    onPressDelete: (media: string) => void;
}

export const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({ refreshing, announcementRef, announcementText, setAnnouncementText, atachmentArr, editPhotoClick, onPressDelete }) => {
    const styles = AddAnnouncementStyles();
    const [showAnnouncementDetail, setshowAnnouncementDetail] = useState(true);
    const renderAttchmentItem = ({ item }: { item: any }) => (
        <>
            {item.mediaType == 'pdf' ? (
                <TouchableOpacity
                    onPress={() => onPressDelete(item.media)}
                    style={styles.pdfContainer}>
                    <Image
                        source={IMAGES.pdf}
                        style={styles.pdfIcon}
                        resizeMode="contain"
                    />
                    <CustomText style={{ width: '80%' }} textProps={{ numberOfLines: 2 }}>
                        {item?.mediaName}
                    </CustomText>
                    <TouchableOpacity
                        style={{ marginTop: -50 }}
                        onPress={() => onPressDelete(item.media)}>
                        <Image source={IMAGES.delete} resizeMode="contain" />
                    </TouchableOpacity>
                </TouchableOpacity>
            ) : (
                <ImageBackground
                    source={{ uri: item.media }}
                    style={styles.attachImgWrapper}
                    imageStyle={{ borderRadius: radiusScale(8) }}>
                    <TouchableOpacity
                        style={{ alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => onPressDelete(item.media)}>
                        <Image source={IMAGES.delete} resizeMode="contain" />
                    </TouchableOpacity>
                </ImageBackground>
            )}
        </>
    );

    return (
        <View>
            {!showAnnouncementDetail ? (
                <View style={[styles.Detailcontainer]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text style={styles.headerTitle}>
                            {ANNOUNCEMENT.Announcement_Details}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setshowAnnouncementDetail(!showAnnouncementDetail);
                            }}
                            style={styles.iconWrapper}>
                            <Image source={IMAGES.downArrow} style={styles.downicon} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={[styles.Detailcontainer]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text style={styles.headerTitle}>
                            {ANNOUNCEMENT.Announcement_Details}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setshowAnnouncementDetail(!showAnnouncementDetail);
                            }}
                            style={styles.iconWrapper}>
                            <Image source={IMAGES.upArrow} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lineView} />
                    {refreshing && (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <ActivityIndicator color={COLORS.black} />
                        </View>
                    )}
                    <Input
                        editable={true}
                        isRequired={true}
                        multiline={true}
                        ref={announcementRef}
                        placeholder={ANNOUNCEMENT.Share_updates}
                        defaultValue={announcementText}
                        onChangeText={setAnnouncementText}
                        label={ANNOUNCEMENT.Announcement}
                        errorMessage={ERROR_MESSAGE.ANNOUNCEMENT_DETAIL_ERROR}
                        hasHandler={true}
                    />
                    <Text style={styles.label}>{ANNOUNCEMENT.Attachments}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        {atachmentArr.length < 3 && (
                            <TouchableOpacity
                                onPress={() => editPhotoClick()}
                                style={styles.attachWrapper}>
                                <Image source={IMAGES.upload} style={styles.icon} />
                            </TouchableOpacity>
                        )}
                        <FlatList
                            data={atachmentArr}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderAttchmentItem}
                        />
                    </View>
                    <Text style={styles.attachDescription}>
                        {ANNOUNCEMENT.Attachments_Descripiton}
                    </Text>
                </View>
            )}
        </View>
    );
}