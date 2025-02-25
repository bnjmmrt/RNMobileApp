import React = require("react")
import { FlatList, Image, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native"
import Header from "src/component/Header/Header"
import { BUTTON_LABLE, COLORS, ERROR_MESSAGE, EVENT_STATUS, LABLE } from "src/utils/constants"
import { styles } from "./styles"
import { useNavigation, useRoute } from "@react-navigation/native"
import { View } from "react-native"
import IMAGES from "@images/index"
import { CustomText } from "src/component/CustomText"
import Button from "src/component/Button"
import { useDispatch, useSelector } from "react-redux"
import { addGuest, deleteGuest, resetGuest, setResponse, setSelectedGuest } from "src/redux/slices/rspvSlice"
import { SwipeableGuestList } from "./SwipeableGuestList"
import CustomSelectableText from "src/component/CustomSelectableText/CustomSelectableText"
import { fontScale, verticalMarginScale } from "src/utils/dimensions"
import useContacts from "src/utils/hooks/useContactPermission"
import BottomSheetComponent from "src/component/BottomSheet/BottomSheet"
import RenderCancelPopup from "./RenderCancelPopup"
import Title from 'src/component/Title/Title';
import FastImage from "@d11/react-native-fast-image"
import Toast from "src/component/Toast/Toast"
import { useAcceptInvitationMutation, useDeclineApplicationMutation, useDeleteConfirmedGuestMutation, useInviteGuestsMutation } from "src/redux/actions/rspvApiAction"
import { RootState } from "src/redux/slices"
import useApi from "src/axios/useApi"
import SelectReason from "./BottomSheetView/SelectReason"
import MessageBox from "./BottomSheetView/MessageBox"
import formatToDeviceTimeZone from "src/utils/formatToDeviceTimeZone"
import { fontFamily } from "src/utils/functions"

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
type Invitee = {
    guestStatus: string;
};

const calculateAvailableGuestPasses = (invitees: Invitee[], maxAdditionalGuest: number): number => {
    const confirmedGuests = invitees.filter((guest) => guest.guestStatus !== 'DECLINED').length;
    const availableGuestPasses = Math.max(maxAdditionalGuest - confirmedGuests, 0);
    return availableGuestPasses;
};

export const EventCard = ({ name, location, imageCover, dates = ['', ''] }) => {

    return (
        <View style={styles.card}>
            <FastImage
                source={{ uri: imageCover }}
                resizeMode={FastImage.resizeMode.cover}
                defaultSource={IMAGES.eventCoverPlaceholders1}
                style={styles.image}
            />
            <View style={styles.info}>
                <CustomText style={styles.title}>{name}</CustomText>
                <CustomText style={styles.details}>{dates[0]} {dates[1]}</CustomText>
                <CustomText style={styles.details}>{location}</CustomText>
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
const optionList = [
    { id: 1, label: 'Cancel Application' },
];

const RSVPInvitedUpcoming = () => {
    const { params } = useRoute();
    const scrollRef = React.useRef(null);
    const { id, name, location, imageCover, startDate, endDate } = params.event;
    const [maxAdditionalGuests, setMaxAdditionalGuests] = React.useState(0);
    const status = params.event.currentGuestStatus;
    const { requestContactPermission } = useContacts();
    const { navigate, goBack } = useNavigation();
    const [activeView, setActiveTab] = React.useState<string>('');
    const bottomSheetRef = React.useRef<any>(null);
    const dispatch = useDispatch();
    const [selectedReason, setSelectedReason] = React.useState<any>({});
    const [reasonSelected, setReasonSelected] = React.useState<any>('');
    const [showInfo, setShowInfo] = React.useState<boolean | null>(false);
    const [isToastShown, setIsToastShown] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [declineApplication, { isLoading: declineLoading, isError: declineError }] = useDeclineApplicationMutation();
    const [acceptInvite, { isLoading: acceptLoading, isError: acceptError }] = useAcceptInvitationMutation();
    const userId = useSelector((state: RootState) => state.auth.userId);
    const [invites, setInvites] = React.useState([]);
    const [inviteGuests, { isLoading: guestLoading, isError: addError }] = useInviteGuestsMutation();
    const [deleteConfirmedGuest, { isLoading: deleteGuestLoading, isError: deleteGuestError, isSuccess: deleteGuestSuccess }] = useDeleteConfirmedGuestMutation();
    const { apiRequest, loading, error } = useApi();
    const [selectedDeleteGuest, setSelectedDeleteGuest] = React.useState(null);
    const rspv = useSelector(state => state.rspv);

    React.useEffect(() => {
        getInvitees();
    }, []);
    React.useEffect(() => {
        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });

        }, 500);
    }, [showInfo])

    React.useEffect(() => {
        if (deleteGuestSuccess) {
            bottomSheetRef?.current?.close();
            getInvitees();
        }
    }, [deleteGuestError, deleteGuestSuccess]);

    const getInvitees = async () => {
        const response: any = await apiRequest('get', `v1/users/${userId}/events/${id}/invited-guests`);
        if (response.data) {
            setInvites(response.data[0].invitees);
            setMaxAdditionalGuests(response.data[0].maxAdditionalGuests)
        } else {
            setErrorMessage('Failed to fetch invitees');
        }
    };

    const handleResponse = (response) => {
        setIsToastShown(false);
        dispatch(setResponse(response));
    };
    const onAddGuest = async () => {
        if (calculateAvailableGuestPasses(combinedGuests, maxAdditionalGuests) === 0) {
            scrollRef.current?.scrollToEnd({ animated: true });
            setIsToastShown(true);
        }
        else {
            await requestContactPermission();
            navigate('AddGuestOptionScreen');
        }

    };
    const onClickReason = () => {
        setActiveTab('reasons');
        bottomSheetRef?.current?.open();
    };

    const onClickGuest = () => {
        setActiveTab('noofguests');
        bottomSheetRef?.current?.open();
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
                return Platform.OS == 'android' ? '95%' : '85%';
            case 'leave':
                return '40%';
            case 'remove':
                return '40%';
            case 'reasons':
                return '65%';
            case 'noofguests':
                return '40%';
            case 'success':
                return '45%';
            case 'failed':
                return '45%'
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
                return <RenderCancelPopup id={id} onClose={() => {
                    bottomSheetRef?.current?.close();
                    goBack();
                }} setReasonSelected={setReasonSelected} reasonSelected={reasonSelected} />;
            case 'reasons':
                return <SelectReason list={reasons}
                    handleSelect={(item) => {
                        setSelectedReason(item);
                        setErrorMessage('')
                        bottomSheetRef?.current?.close();
                    }
                    }
                />;
            case 'noofguests':
                return <SelectReason list={generateGuestList(maxAdditionalGuests)}
                    handleSelect={(item) => {
                        console.log(item)
                        dispatch(setSelectedGuest(item))
                        bottomSheetRef?.current?.close();
                    }
                    }
                />;
            case 'failed':
                return <MessageBox
                    title={LABLE.WE_WERE_SORRY_CANT_MAKE_IT}
                    subTitle={LABLE.RSVP_SUBTITLE}
                    status={LABLE.YOU_DECLINED_THIS_INVITATION}
                    btnLabel={LABLE.DISCOVER_MORE_EVENTS}
                    onClose={() => {
                        bottomSheetRef?.current?.close();
                        navigate('BottomTabBar')
                    }}
                    btnStyle={[styles.clearButton, styles.btnBorder]}
                />;
            case 'success':
                return <MessageBox
                    title={LABLE.YOUR_RSPV_IS}
                    subTitle={LABLE.YOU_CAN_RETURN_TO_THE}
                    status={"You are going"}
                    isSuccess={true}
                    btnLabel={LABLE.DISCOVER_MORE_EVENTS}
                    onClose={() => {
                        bottomSheetRef?.current?.close();
                        navigate('BottomTabBar')
                    }}
                    btnStyle={[styles.clearButton, styles.btnBorder]}
                />;

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
                onPress={goBack}
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
                loading={deleteGuestLoading}
                title={'Remove Guest'}
                colorTheme="dark"
                onPress={() => {
                    handleRemoveGuest(userId, id, selectedDeleteGuest?.id)
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
    const handleRemoveGuest = async (userId, eventId, guestId) => {
        try {
            await deleteConfirmedGuest({ userId, eventId, id: guestId });
        } catch (error) {
            console.error('Failed to remove guest:', error);
        }
    };

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
        if (rspv.response) {
            if (rspv?.response == "No") {
                if (validateInputs()) {
                    handleDecline();
                }
            }
            else {
                handleInviteGuests('add');
            }
        }
        else {
            setIsToastShown(true);
        }
    };
    const onUpdate = () => {
        if (rspv?.guests.length > 0) {
            handleInviteGuests('update');
        }
    };
    const handleInviteGuests = async (value) => {
        try {
            if (value == 'add') {
                const accept_response = await acceptInvite({
                    id: userId,
                    eventId: id
                });
                const response = await inviteGuests({
                    userId: userId,
                    eventId: id,
                    guests: rspv?.guests,
                });
                console.log(accept_response)
                dispatch(resetGuest());
                setActiveTab('success');
                bottomSheetRef?.current?.open();
            }
            else {
                const response = await inviteGuests({
                    userId: userId,
                    eventId: id,
                    guests: rspv?.guests,
                });
                dispatch(resetGuest());
                getInvitees();
            }

        } catch (error) {
            console.error('Failed to invite guests:', error);
        }
    };
    const validateInputs = () => {
        if (!selectedReason.name) {
            setErrorMessage("Please select a reason");
            return false;
        }
        setErrorMessage(null);
        return true;
    };
    const handleDecline = async () => {
        try {
            const response = await declineApplication({
                id: userId,
                eventId: id,
                reason: selectedReason.name,
                guestId: ""
            });

            if (response?.data) {
                setActiveTab('failed');
                bottomSheetRef?.current?.open();
                console.log('Application declined successfully:', response.data);
            } else {
                console.warn('Failed to decline the application.');

            }
        } catch (error) {
            console.error('Error declining the application:', error);
        }
    };



    const renderInvitedRSVPView = () => {
        return (
            <>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, paddingBottom: 24 }}>
                        <EventCard name={name} location={location?.location} imageCover={imageCover} dates={formatToDeviceTimeZone(startDate, endDate)} />
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
                                    errorMessage={errorMessage}
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
                                        The host is offering you the option to bring up to {maxAdditionalGuests} guests. How many guests would you like to bring?
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
                                                    onDelete={() => dispatch(deleteGuest({ phoneNumber: guest.phoneNumber, email: guest.email }))} />
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
                {isToastShown && (
                    <View style={styles.toastWrapper}>
                        <Toast
                            message={'Please select at least one'}
                            onClose={() => setIsToastShown(false)}
                        />
                    </View>
                )}

                <Button
                    disabled={false}
                    style={styles.btnStyle}
                    title={BUTTON_LABLE.SUBMIT}
                    colorTheme="dark"
                    loading={guestLoading}
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
            onDelete={(value) => {
                console.log(item)
                if (value.type === 'local') {
                    dispatch(deleteGuest({ phoneNumber: item.phoneNumber, email: item.email }))
                }
                else {
                    setSelectedDeleteGuest(item)
                    setActiveTab('remove');
                    bottomSheetRef.current.open();
                }
            }}
            onInfoClick={() => {
                setShowInfo(!showInfo);
            }}
        />
    );
    const renderUpcomingRSVPView = () => {
        return (
            <>
                <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
                    <View style={{ flex: 1, paddingBottom: 24 }}>
                        <EventCard name={name} location={location?.location} imageCover={imageCover} dates={formatToDeviceTimeZone(startDate, endDate)} />
                        <StatusBanner isGoing={true} onPress={() => {
                            setActiveTab('options')
                            bottomSheetRef?.current.open()
                        }} />
                        <View style={{ gap: 6 }}>
                            <CustomText style={{ color: COLORS.light_gray }}>You have {calculateAvailableGuestPasses(combinedGuests, maxAdditionalGuests)} guest passes available </CustomText>
                            <FlatList
                                data={combinedGuests}
                                renderItem={renderItem}
                                nestedScrollEnabled
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
                            />
                            <Button
                                disabled={false}
                                style={[styles.clearButton, styles.btnBorder]}
                                title={BUTTON_LABLE.ADD_GUEST_DETAILS}
                                colorTheme="white"
                                onPress={onAddGuest}
                            />
                            {(isToastShown && calculateAvailableGuestPasses(combinedGuests, maxAdditionalGuests) === 0) && <View style={styles.toastNoGuest}>
                                <TouchableOpacity onPress={() => setIsToastShown(false)}>
                                    <Image source={IMAGES.close} />
                                </TouchableOpacity>
                                <CustomText style={{ color: COLORS.black, fontSize: fontScale(14) }}>No guest passes remaining.</CustomText>
                            </View>}

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

                <CustomText style={{ color: COLORS.light_gray, textAlign: 'center', paddingTop: 12, paddingBottom: 8 }}>Please add your additional guests’ details by {formatToDeviceTimeZone(startDate, endDate)}, or their passes will be canceled.</CustomText>
                <Button
                    disabled={false}
                    loading={guestLoading}
                    style={styles.btnStyle}
                    title={"Update RSVP"}
                    colorTheme="dark"
                    onPress={onUpdate}
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
                <BottomSheetComponent
                    ref={bottomSheetRef}
                    onClose={() => { (activeView == "success" || activeView == "failed") && goBack() }}
                    snapPoints={[getSnapPoints()]}>
                    <View style={styles.bottomSheetContent}>
                        {renderBottomSheetContent()}
                    </View>
                </BottomSheetComponent>

            </View>


        </SafeAreaView>
    )
}
export default RSVPInvitedUpcoming;