import React = require("react")
import { FlatList, Image, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native"
import Header from "src/component/Header/Header"
import { BUTTON_LABLE, COLORS, EVENT_STATUS, LABLE } from "src/utils/constants"
import { styles } from "./styles"
import { useNavigation, useRoute } from "@react-navigation/native"
import { View } from "react-native"
import IMAGES from "@images/index"
import { CustomText } from "src/component/CustomText"
import Button from "src/component/Button"
import { useDispatch, useSelector } from "react-redux"
import { deleteGuest, setResponse, setSelectedGuest } from "src/redux/slices/rspvSlice"
import { SwipeableGuestList } from "./SwipeableGuestList"
import CustomSelectableText from "src/component/CustomSelectableText/CustomSelectableText"
import { verticalMarginScale } from "src/utils/dimensions"
import useContacts from "src/utils/hooks/useContactPermission"
import BottomSheetComponent from "src/component/BottomSheet/BottomSheet"
import ListComponentBottomSheet from "src/component/BottomSheet/ListComponentBottomSheet"
import ConfirmationBottomSheet from "src/component/BottomSheet/ConfirmationBottomSheet"
import RenderCancelPopup from "./RenderCancelPopup"
import Title from 'src/component/Title/Title';

const reasons = [
    { id: 1, name: 'Scheduling Conflict' },
    { id: 2, name: 'Prior Commitment' },
    { id: 3, name: 'Traveling' },
    { id: 4, name: 'Event Location Inconvenient' },
    { id: 5, name: 'Not Interested in This Event' },
    { id: 6, name: 'Too Short of Notice' },
    { id: 7, name: 'Weather Concerns' },
    { id: 8, name: 'Other' },
];
type Guest = {
    id: number;
    name: string;
};

export const EventCard = ({ name }) => {
    return (
        <View style={styles.card}>
            <Image source={IMAGES.frame} style={styles.image} />
            <View style={styles.info}>
                <CustomText style={styles.title}>{name}</CustomText>
                <CustomText style={styles.details}>Fri, April 13, 9:00PM - 11:00PM EST</CustomText>
                <CustomText style={styles.details}>Los Angeles, California</CustomText>
            </View>
        </View>
    );
};
const StatusBanner = ({ isGoing, onPress }) => {
    return (isGoing ?
        <TouchableOpacity onPress={onPress} style={[styles.statusBanner, { backgroundColor: COLORS.bgGreen }]}>
            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                <Image source={IMAGES.tickGoing} />
                <CustomText style={styles.statusText}> {'You are going'}</CustomText>
            </View>
            <Image source={IMAGES.downArrow} style={{ width: 12, height: 12, resizeMode: 'contain' }} />
        </TouchableOpacity>
        :
        <View style={styles.statusBanner}>
            <Image source={IMAGES.tickInvited} />
            <CustomText style={styles.statusText}> {EVENT_STATUS.INVITED}</CustomText>
        </View>
    );
};
const invites = [{
    "addedBy": "",
    "addedByPicture": "",
    "age": 0,
    "category": [],
    "checkIn": false,
    "email": "akash.kothawade+1036@techalchemy.com",
    "firstName": "sky",
    "guestId": "f5ec8047-487d-4474-bc44-383f9dc61bba",
    "guestStatus": "CONFIRMED",
    "id": "f5ec8047-487d-4474-bc44-383f9dc61bba",
    "invitationSource": -1,
    "invitees": [],
    "lastName": "test",
    "phoneNumber": "+9087654567",
    "profilePicture": "",
    "source": "",
    "status": "NO_STATUS",
    "userId": "c8d62410-953f-4f5c-9c8f-666ea9b55b60",
    "username": ""
},
{
    "addedBy": "",
    "addedByPicture": "",
    "age": 26,
    "category": [],
    "checkIn": false,
    "email": "akash.kothawade+1014@techalchemy.com",
    "firstName": "akash",
    "guestId": "1e454374-f8ad-42e2-8320-0405ddd2f5b9",
    "guestStatus": "DECLINED",
    "id": "09a2fc69-a938-4dc8-8d82-b3c6c78b3606",
    "invitationSource": "INVITED_BY_HOST",
    "invitees": [],
    "lastName": "kakak",
    "maxAdditionalGuests": 4,
    "numberAdditionalGuests": 4,
    "phoneNumber": "+919898907028",
    "profilePicture": "laksdf;lkajsdfljasdjfk",
    "source": "",
    "status": "NO_STATUS",
    "userId": "1aeb0084-e6ad-4878-b1b0-feb1d84ddac9",
    "username": ""
},
];
const optionList = [
    { id: 1, label: 'Cancel Application' },
];
const RSVPInvitedUpcoming = () => {
    const { params } = useRoute();
    const status = params.event.currentGuestStatus;
    const { requestContactPermission } = useContacts();
    const { navigate, goBack } = useNavigation();
    const [activeView, setActiveTab] = React.useState<string>('');
    const bottomSheetRef = React.useRef<any>(null);
    const dispatch = useDispatch();
    const [selectedReason, setSelectedReason] = React.useState<any>({});
    const [reasonSelected, setReasonSelected] = React.useState<any>('');
    const reasonsRef = React.useRef<any>(null);
    const guestRef = React.useRef<any>(null);
    const confirmationRef = React.useRef<any>(null);
    const cancelRef = React.useRef<any>(null);
    const [showInfo, setShowInfo] = React.useState<boolean | null>(false);

    const rspv = useSelector(state => state.rspv);

    const handleResponse = (response) => {
        dispatch(setResponse(response));
    };
    const onAddGuest = async () => {
        await requestContactPermission();
        navigate('AddGuestOptionScreen');
    };
    const onClickReason = () => {
        reasonsRef?.current.open();
    };

    const onClickGuest = () => {
        guestRef?.current.open();
    };

    const generateGuestList = (guestsCount: number): Guest[] => {
        const guestList: Guest[] = [{ id: 0, name: 'No Guests' }];

        for (let i = 1; i <= guestsCount; i++) {
            guestList.push({ id: i, name: `${i} Guest${i > 1 ? 's' : ''}` });
        }
        return guestList;
    };

    const getSnapPoints = (): string => {
        switch (activeView) {
            case 'guests':
                return '30%';
            case 'submit':
                return '60%';
            case 'options':
                return '20%';
            case 'cancel':
                return '85%';
            case 'leave':
                return '40%';
            case 'remove':
                return '40%';
            default:
                return '85%';
        }
    };


    const renderBottomSheetContent = () => {
        switch (activeView) {
            case 'leave':
                return renderLeaveWithoutSubmitting();
            case 'remove':
                return renderRemoveGuest();
            case 'options':
                return renderOptions();
            case 'cancel':
                return <RenderCancelPopup setReasonSelected={setReasonSelected} reasonSelected={reasonSelected} />;
            default:
                return null;
        }
    };
    const renderLeaveWithoutSubmitting = () => (
        <View style={styles.leaveContainer}>
            <Title
                align="center"
                title="Leave without submitting?"
                subTitle="Are you sure you want to go back? Your changes will not be saved."
            />
            <Button
                disabled={false}
                style={styles.btnStyle}
                title={'Leave'}
                colorTheme="dark"
                onPress={() => {

                }}
            />
            <Button
                disabled={false}
                buttonType="stripe"
                style={styles.btnStyle}
                onPress={() => {
                    bottomSheetRef?.current?.close();
                }}
                title={'Cancel'}
                colorTheme="dark"
            />
        </View>
    );
    const renderRemoveGuest = () => (
        <View style={styles.leaveContainer}>
            <Title
                align="center"
                title="Remove Guest?"
                subTitle="Are you sure you want to remove this guest?They will be notified that their pass has been canceled. You can add a new guest later. "
            />
            <Button
                disabled={false}
                style={styles.btnStyle}
                title={'Remove Guest'}
                colorTheme="dark"
                onPress={() => {

                }}
            />
            <Button
                disabled={false}
                buttonType="stripe"
                style={styles.btnStyle}
                onPress={() => {
                    bottomSheetRef?.current?.close();
                }}
                title={'Cancel'}
                colorTheme="dark"
            />
        </View>
    );

    const renderOptions = () =>
        optionList.map(item => (
            <TouchableOpacity
                key={item.id}
                style={styles.guestButton}
                onPress={() => {
                    setActiveTab(item?.id === 1 ? 'cancel' : 'vouch');
                    bottomSheetRef?.current?.open();
                }}>
                <Text style={styles.guestButtonText}>{item.label}</Text>
            </TouchableOpacity>
        ));
    const onSubmit = () => {
        if (rspv?.response === "No") {
            cancelRef.current.open();
        } else {
            confirmationRef.current.open();
        }
    };

    const renderInvitedRSVPView = () => {
        return (
            <>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, paddingBottom: 24 }}>
                        <EventCard />
                        <StatusBanner />
                        <View style={[styles.card, { flexDirection: 'column' }]}>
                            <View>
                                <CustomText style={styles.info}>Would you like to attend the event?</CustomText>
                            </View>
                            <View style={styles.rsvpButtonsRow}>
                                <Button
                                    disabled={false}
                                    title={BUTTON_LABLE.YES}
                                    onPress={() => handleResponse('Yes')}
                                    style={
                                        rspv.response == 'Yes'
                                            ? styles.smallButton
                                            : styles.clearButton
                                    }
                                    clearButtonStyle={
                                        rspv.response == 'No' ? styles.clearButton : styles.smallButton
                                    }
                                    colorTheme={rspv.response == 'Yes' ? 'dark' : 'white'}
                                />
                                <Button
                                    disabled={false}
                                    title={BUTTON_LABLE.NO}
                                    onPress={() => handleResponse('No')}
                                    style={
                                        rspv.response == 'No' ? styles.smallButton : styles.clearButton
                                    }
                                    clearButtonStyle={
                                        rspv.response == 'Yes'
                                            ? styles.clearButton
                                            : styles.smallButton
                                    }
                                    colorTheme={rspv.response == 'No' ? 'dark' : 'white'}
                                />
                            </View>
                        </View>
                        {rspv.response == 'No' && (
                            <View style={{ padding: verticalMarginScale(12) }}>
                                <Text style={styles.label}>Why can’t you attend?</Text>
                                <CustomSelectableText
                                    placeholder={'Select...'}
                                    rightImage={IMAGES.downArrow}
                                    errorMessage={''}
                                    defaultValue={selectedReason?.name}
                                    onPress={onClickReason}
                                    style={{ marginTop: verticalMarginScale(4) }}
                                />
                                <Text style={styles.infoText}>{LABLE.RSVP_TEXT}</Text>
                            </View>
                        )}
                        {rspv.response == 'Yes' && (
                            <>
                                <View>
                                    <Text style={[styles.infoText, { color: COLORS.black }]}>
                                        {LABLE.RSVP_QUESTION_DETAILS}
                                    </Text>
                                    <CustomSelectableText
                                        placeholder={'No Guest'}
                                        rightImage={IMAGES.downArrow}
                                        errorMessage={''}
                                        defaultValue={rspv?.selectedGuest?.name}
                                        onPress={onClickGuest}
                                        style={styles.customSelectText}
                                    />
                                </View>
                                {rspv?.selectedGuest?.name != rspv?.guests[0]?.name && (
                                    <>
                                        <View style={{ gap: 6 }}>
                                            {rspv.guests.map(guest => (
                                                <SwipeableGuestList
                                                    key={guest.id}
                                                    guest={guest}
                                                    onDelete={() => dispatch(deleteGuest(guest.id))}
                                                />
                                            ))}
                                        </View>
                                        {rspv?.selectedGuest?.id > rspv?.guests?.length && <Button
                                            disabled={false}
                                            style={[styles.clearButton, styles.btnBorder]}
                                            title={BUTTON_LABLE.ADD_GUEST_DETAILS}
                                            colorTheme="white"
                                            onPress={onAddGuest}
                                        />}
                                    </>
                                )}
                            </>
                        )}
                    </View>
                </ScrollView>

                <Button
                    disabled={false}
                    style={styles.btnStyle}
                    title={BUTTON_LABLE.SUBMIT}
                    colorTheme="dark"
                    onPress={onSubmit}
                />
            </>

        )
    }
    const combinedGuests = [
        ...rspv.guests.map(guest => ({ ...guest, type: 'rspv' })),
        ...invites.map(guest => ({ ...guest, type: 'invite' })),
    ];

    const renderItem = ({ item }) => (
        <SwipeableGuestList
            key={item.id}
            guest={item}
            onDelete={(item) => {
                console.log(item)
                if (item.type === 'local') {
                    dispatch(deleteGuest(item.id))
                }
                else {
                    setActiveTab('remove');
                    bottomSheetRef.current.open();
                }
            }}
            onInfoClick={() => setShowInfo(!showInfo)}
        />
    );
    const renderUpcomingRSVPView = () => {
        return (
            <>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, paddingBottom: 24 }}>
                        <EventCard />
                        <StatusBanner isGoing={true} onPress={() => {
                            setActiveTab('options')
                            bottomSheetRef?.current.open()
                        }} />
                        <View style={{ gap: 6 }}>
                            <CustomText style={{ color: COLORS.light_gray }}>You have 0 guest passes available </CustomText>
                            <FlatList
                                data={combinedGuests}
                                renderItem={renderItem}
                                nestedScrollEnabled
                                keyExtractor={item => item.id.toString()}
                                ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
                            />
                            <Button
                                disabled={false}
                                style={[styles.clearButton, styles.btnBorder]}
                                title={BUTTON_LABLE.ADD_GUEST_DETAILS}
                                colorTheme="white"
                                onPress={onAddGuest}
                            />
                        </View>
                        {showInfo &&
                            <>
                                <CustomText style={{ color: COLORS.black, marginTop: 12 }}>Guests can be declined for various reasons, such as:</CustomText>
                                <View style={{ padding: 6 }}>
                                    <CustomText style={{ color: COLORS.black }}>•  The guest has already requested an invited or was already invited by the host.</CustomText>
                                    <CustomText style={{ color: COLORS.black }}>•  The guest has already requested an invited or was already invited by the host.</CustomText>
                                    <CustomText style={{ color: COLORS.black }}>•  The guest has already requested an invited or was already invited by the host.</CustomText>
                                </View>
                            </>
                        }
                    </View>
                </ScrollView>
                <CustomText style={{ color: COLORS.light_gray, textAlign: 'center', paddingTop: 12, paddingBottom: 8 }}>Please add your additional guests’ details by [event date and time], or their passes will be canceled.</CustomText>
                <Button
                    disabled={false}
                    style={styles.btnStyle}
                    title={"Update RSVP"}
                    colorTheme="dark"
                    onPress={onSubmit}
                />
            </>

        )
    }
    const handleBackPress = () => {
        if (rspv?.guests?.length > 0) {
            setActiveTab('leave');
            bottomSheetRef.current?.open();
        }
        else {
            goBack();
        }
    }
    return (

        <SafeAreaView style={styles.container}>
            <Header
                headerTitle={BUTTON_LABLE.RSVP}
                showProgressBar={false}
                onPress={handleBackPress}
            />
            <View style={{ paddingHorizontal: 12, flex: 1 }}>
                {status === 'INVITED' && renderInvitedRSVPView()}
                {status === 'CONFIRMED' && renderUpcomingRSVPView()}

            </View>
            <BottomSheetComponent
                ref={bottomSheetRef}
                snapPoints={[getSnapPoints()]}>
                <View style={styles.bottomSheetContent}>
                    {renderBottomSheetContent()}
                </View>
            </BottomSheetComponent>
            <ListComponentBottomSheet
                ref={reasonsRef}
                list={reasons}
                selectedItem={setSelectedReason}
                snapPoints={[Platform.OS === 'android' ? '65%' : '60%']}
            />
            <ListComponentBottomSheet
                ref={guestRef}
                list={generateGuestList(5)}
                selectedItem={(guest) => dispatch(setSelectedGuest(guest))}
                snapPoints={[Platform.OS === 'android' ? '45%' : '40%']}
            />
            <ConfirmationBottomSheet
                ref={cancelRef}
                title={LABLE.WE_WERE_SORRY_CANT_MAKE_IT}
                subTitle={LABLE.RSVP_SUBTITLE}
                status={LABLE.YOU_DECLINED_THIS_INVITATION}
                btnLabel={LABLE.DISCOVER_MORE_EVENTS}
                snapPoints={[Platform.OS === 'android' ? '40%' : '38%']}
                btnStyle={[styles.clearButton, styles.btnBorder]}
            />
            <ConfirmationBottomSheet
                ref={confirmationRef}
                title={LABLE.YOUR_RSPV_IS}
                subTitle={LABLE.YOU_CAN_RETURN_TO_THE}
                status={"You are going"}
                isSuccess={true}
                btnLabel={LABLE.DISCOVER_MORE_EVENTS}
                snapPoints={[Platform.OS === 'android' ? '40%' : '38%']}
                btnStyle={[styles.clearButton, styles.btnBorder]}
            />


        </SafeAreaView>
    )
}
export default RSVPInvitedUpcoming;