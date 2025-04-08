import React, { useCallback, useState } from "react";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "src/component/Button";
import AddAnnouncementStyles from "./AddAnnouncement/AddAnnouncementStyles";
import { ANNOUNCEMENT, COLORS, ERROR_MESSAGE } from "src/utils/constants";
import IMAGES from "@images/index";
import { horizontalScale, verticalMarginScale, verticalScale } from "src/utils/dimensions";
import { CustomText } from "src/component/CustomText";
import Tooltip, { Placement } from "react-native-tooltip-2";
import AvatarInitials from "src/component/AvatarInitials";

interface RecipientProps {
    allRecipients: any[];
    ticketerrorMessage: boolean;
    announcementId: string | null;
    ticketTypeRef: React.RefObject<any>;
    ticketTypeArr: any[];
    removeTicketType: (item: any) => void;
    setActiveTab: (tab: string) => void;
    setSelectedTicketType: (ticketType: any[]) => void;
    bottomSheetRef: React.RefObject<any>;
    addedByerrorMessage: boolean;
    addedRef: React.RefObject<any>;
    collaboratorArr: any[];
    removeCollaborator: (item: any) => void;
    setselectedCollaborator: (collaborator: any[]) => void;
    recipienterrorMessage: boolean;
}

export const RecipientDetail: React.FC<RecipientProps> = ({ ticketerrorMessage, announcementId, ticketTypeRef, ticketTypeArr, removeTicketType, setActiveTab, setSelectedTicketType, bottomSheetRef, addedByerrorMessage, collaboratorArr, addedRef, removeCollaborator, setselectedCollaborator, recipienterrorMessage, allRecipients }) => {
    const styles = AddAnnouncementStyles();
    const [showRecipientDetail, setshowRecipientDetail] = useState(true);
    const [showProfileToolitip, setShowProfileToolitip] = useState(false);
    const [showTicketTooltip, setshowTicketTooltip] = useState(false);
    return (
        <>
            {!showRecipientDetail ? (
                <View style={[styles.Detailcontainer]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text style={styles.headerTitle}>
                            {ANNOUNCEMENT.Recipient_Details}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setshowRecipientDetail(!showRecipientDetail);
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
                            {ANNOUNCEMENT.Recipient_Details}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setshowRecipientDetail(!showRecipientDetail);
                            }}
                            style={styles.iconWrapper}>
                            <Image source={IMAGES.upArrow} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerDes}>
                        {ANNOUNCEMENT.Announcement_Description}
                    </Text>
                    <View style={styles.lineView} />
                    <View>
                        <CustomText style={[styles.label]}>
                            {ANNOUNCEMENT.Ticket_Type}
                            <CustomText style={{ color: COLORS.errorText }}>
                                {' '}
                                *
                            </CustomText>
                            <TouchableOpacity
                                onPress={() => setshowTicketTooltip(!showTicketTooltip)}>
                                <Image
                                    style={{ marginTop: 25, left: 5, resizeMode: 'contain' }}
                                    tintColor={COLORS.light_gray}
                                    source={IMAGES.info_filled}
                                />
                            </TouchableOpacity>
                        </CustomText>
                        <Tooltip
                            contentStyle={[
                                styles.toolTipStyle,
                                {
                                    height: verticalScale(20),
                                },
                            ]}
                            isVisible={showTicketTooltip}
                            displayInsets={{
                                left: 0,
                                right: 260,
                                top: 0,
                                bottom: 0,
                            }}
                            arrowStyle={{ left: -10 }}
                            backgroundColor="transparent"
                            topAdjustment={verticalScale(-10)}
                            content={
                                <View>
                                    <Text style={styles.tooltipHeadStyle}>
                                        {ANNOUNCEMENT.ANNOUNCEMENT_TICKET_TOOLTIP}
                                    </Text>
                                </View>
                            }
                            placement={Placement.RIGHT}
                            onClose={() => setshowTicketTooltip(false)}>
                            <View />
                        </Tooltip>
                        <View
                            style={
                                ticketerrorMessage
                                    ? styles.errorContainer
                                    : [
                                        styles.inputContainer,
                                        {
                                            backgroundColor:
                                                announcementId != null
                                                    ? COLORS.lighter_gray
                                                    : 'white',
                                        },
                                    ]
                            }>
                            <View ref={ticketTypeRef} style={styles.userInfoContainer}>
                                {ticketTypeArr?.length == 0 ? (
                                    <Text style={[styles.inputStyle, { left: 0 }]}>
                                        Please select...
                                    </Text>
                                ) : (
                                    <ScrollView
                                        showsHorizontalScrollIndicator={false}
                                        horizontal={true}
                                        style={{
                                            marginVertical: verticalMarginScale(10),
                                            width: '100%',
                                        }}>
                                        {ticketTypeArr?.map((item: any) => {
                                            return (
                                                <View
                                                    style={[
                                                        styles.countWrapper,
                                                        {
                                                            marginHorizontal: 3,
                                                            paddingVertical: verticalScale(3),
                                                            flexDirection: 'row',
                                                        },
                                                    ]}>
                                                    <Text style={[styles.label, { paddingTop: 0 }]}>
                                                        {item?.name}
                                                    </Text>
                                                    {announcementId == null && (
                                                        <TouchableOpacity
                                                            onPress={() => removeTicketType(item)}>
                                                            <Image
                                                                source={IMAGES.cross}
                                                                style={{ left: 5, resizeMode: 'contain' }}
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                )}
                            </View>
                            <TouchableOpacity
                                style={{
                                    width: '20%',
                                    alignItems: 'center',
                                    paddingVertical: '10%',
                                    marginRight: -20,
                                }}
                                onPress={() => {
                                    if (announcementId == null) {
                                        setActiveTab('ticketTypeOptions');
                                        setSelectedTicketType(ticketTypeArr);
                                        bottomSheetRef?.current?.open();
                                    }
                                }}>
                                <Image style={styles.arrowicon} source={IMAGES.downArrow} />
                            </TouchableOpacity>
                        </View>
                        {ticketerrorMessage ? (
                            <Text style={[styles.errorText]}>
                                {ERROR_MESSAGE.TICKET_TYPE_ERROR}
                            </Text>
                        ) : null}
                    </View>

                    <View>
                        <CustomText style={[styles.label]}>
                            {ANNOUNCEMENT.Added_by}
                            <CustomText style={{ color: COLORS.errorText }}>
                                {' '}
                                *
                            </CustomText>
                            <TouchableOpacity
                                onPress={() =>
                                    setShowProfileToolitip(!showProfileToolitip)
                                }>
                                <Image
                                    style={{ marginTop: 25, left: 5, resizeMode: 'contain' }}
                                    tintColor={COLORS.light_gray}
                                    source={IMAGES.info_filled}
                                />
                            </TouchableOpacity>
                        </CustomText>
                        <Tooltip
                            contentStyle={[
                                styles.toolTipStyle,
                                {
                                    height: verticalScale(90),
                                },
                            ]}
                            isVisible={showProfileToolitip}
                            displayInsets={{
                                left: 0,
                                right: 270,
                                top: 0,
                                bottom: 0,
                            }}
                            arrowStyle={{ left: -10 }}
                            backgroundColor="transparent"
                            topAdjustment={verticalScale(-10)}
                            content={
                                <View>
                                    <Text style={styles.tooltipHeadStyle}>
                                        {ANNOUNCEMENT.ANNOUNCEMENT_TOOLTIP}
                                    </Text>
                                </View>
                            }
                            placement={Placement.RIGHT}
                            onClose={() => setShowProfileToolitip(false)}>
                            <View />
                        </Tooltip>
                        <View
                            style={
                                addedByerrorMessage
                                    ? styles.errorContainer
                                    : [
                                        styles.inputContainer,
                                        {
                                            backgroundColor:
                                                announcementId != null
                                                    ? COLORS.lighter_gray
                                                    : 'white',
                                        },
                                    ]
                            }>
                            <View ref={addedRef} style={styles.userInfoContainer}>
                                {collaboratorArr?.length == 0 ? (
                                    <Text style={[styles.inputStyle, { left: 0 }]}>
                                        Please select...
                                    </Text>
                                ) : (
                                    <ScrollView
                                        showsHorizontalScrollIndicator={false}
                                        horizontal={true}
                                        style={{ marginVertical: verticalMarginScale(10) }}>
                                        {collaboratorArr?.map((item: any) => {
                                            const collabratorName = announcementId === null ? `${item?.companyName || item?.email} (${item?.role?.name})` : item?.additionalHostInformation?.companyName;
                                            return (
                                                <View
                                                    style={[
                                                        styles.countWrapper,
                                                        {
                                                            marginHorizontal: 3,
                                                            paddingVertical: verticalScale(3),
                                                            flexDirection: 'row',
                                                        },
                                                    ]}>
                                                    <Text style={[styles.label, { paddingTop: 0 }]}>{collabratorName}</Text>
                                                    {announcementId == null && (
                                                        <TouchableOpacity
                                                            onPress={() => removeCollaborator(item)}>
                                                            <Image
                                                                source={IMAGES.cross}
                                                                style={{ left: 5, resizeMode: 'contain' }}
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                )}
                            </View>
                            <TouchableOpacity
                                style={{
                                    width: '20%',
                                    alignItems: 'center',
                                    paddingVertical: '10%',
                                    marginRight: -20,
                                }}
                                onPress={() => {
                                    if (announcementId == null) {
                                        setActiveTab('collaborator');
                                        setselectedCollaborator(collaboratorArr);
                                        bottomSheetRef?.current?.open();
                                    }
                                }}>
                                <Image style={styles.arrowicon} source={IMAGES.downArrow} />
                            </TouchableOpacity>
                        </View>
                        {addedByerrorMessage ? (
                            <Text style={[styles.errorText]}>
                                {ERROR_MESSAGE.COLLABORATOR_ERROR}
                            </Text>
                        ) : null}
                    </View>

                    <View>
                        <Text style={styles.label}>{ANNOUNCEMENT.Send_to}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (announcementId == null) {
                                    setActiveTab('receipient');
                                    bottomSheetRef?.current?.open();
                                }
                            }}
                            style={
                                recipienterrorMessage
                                    ? styles.errorContainer
                                    : [
                                        styles.inputContainer,
                                        {
                                            backgroundColor:
                                                announcementId != null
                                                    ? COLORS.lighter_gray
                                                    : 'white',
                                        },
                                    ]
                            }>
                            <View style={styles.userInfoContainer}>
                                {allRecipients?.length == 0 ? (
                                    <View style={styles.recipintWrapper} />
                                ) : (
                                    <FlatList
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={allRecipients}
                                        renderItem={({ item, index }) => {
                                            const name =
                                                announcementId == null
                                                    ? item?.user?.firstName +
                                                    ' ' +
                                                    item?.user?.lastName
                                                    : item?.firstName + ' ' + item?.lastName;
                                            const profilePicture =
                                                announcementId == null
                                                    ? item?.user?.profilePicture
                                                    : item?.profileImage;
                                            return (
                                                <View>
                                                    {index < 3 ? (
                                                        <View
                                                            style={[
                                                                styles.receipientImg,
                                                                { left: index * -15 },
                                                            ]}>
                                                            <AvatarInitials
                                                                name={name}
                                                                imgUrl={profilePicture}
                                                                size={30}
                                                                textColor="white"
                                                            />
                                                        </View>
                                                    ) : null}
                                                </View>
                                            );
                                        }}
                                    />
                                )}
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        left:
                                            allRecipients.length == 1
                                                ? horizontalScale(-160)
                                                : allRecipients.length == 2
                                                    ? horizontalScale(-140)
                                                    : allRecipients.length >= 3
                                                        ? horizontalScale(-120)
                                                        : horizontalScale(10),
                                    }}>
                                    <Text style={[styles.label, { paddingTop: 0 }]}>
                                        {ANNOUNCEMENT.Recipients}
                                    </Text>
                                    <Text style={styles.attachDes}>
                                        {allRecipients.length} Users
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    if (announcementId == null) {
                                        setActiveTab('receipient');
                                        bottomSheetRef?.current?.open();
                                    }
                                }}>
                                <Image source={IMAGES.arrowRight} resizeMode='contain' />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        {recipienterrorMessage ? (
                            <Text style={[styles.errorText]}>
                                {ERROR_MESSAGE.RECIPIENTS_ERROR}
                            </Text>
                        ) : null}
                    </View>
                </View>
            )}
        </>
    );
}