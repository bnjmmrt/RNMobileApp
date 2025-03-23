import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, BackHandler, RefreshControl, ScrollView, Text, TouchableOpacity, View, Alert, Platform } from "react-native";
import Header from "src/component/Header/Header";
import { ANNOUNCEMENT, collaboratorList, COLORS, ERROR_MESSAGE, ticketTypeList } from "src/utils/constants";
import Input, { InputRefMethods } from "src/component/Input/Input";
import IMAGES from "@images/index";
import BottomSheetComponent from "src/component/BottomSheet/BottomSheet";
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from "src/utils/dimensions";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Button from "src/component/Button";
import EditPictureBottomSheet from "src/component/BottomSheet/EditPictureBottomSheet";
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import useApi from "src/axios/useApi";
import { EndPoint } from "src/ApiManager/config";
import { environment } from "environments/environment";
import SearchInput from "src/component/SearchInput";
import RecipientListItem from "./RecipientListItem";
import EventEmptyRecord from "src/component/EmptyRecord/EventEmptyRecord";
import { useFetchAllUsersQuery } from "src/redux/actions/usersApiAction";
import AvatarInitials from "src/component/AvatarInitials";
import { ApiErrorInterface, fontFamily, getErrorMessage } from "src/utils/functions";
import { constant } from "lodash";
import DocumentBottomSheet from "src/component/BottomSheet/DocumentBottomSheet";
import DocumentPicker from 'react-native-document-picker';
import { FlashMessageComponent } from "src/component/FlashMessageComponent/FlashMessageComponent";
import AddAnnouncementStyles from "./AddAnnouncementStyles";
import ConfirmationBottomSheet from "src/component/BottomSheet/ConfirmationBottomSheet";
import { useCreateEventAnnouncementMutation, useDeleteEventAnnouncementMutation, useEditEventAnnouncementMutation, useFetchAnnouncementDetailQuery, useFetchAnnouncementRecipientsQuery, useFetchSelectedRecipientsQuery } from "src/redux/actions/eventApiAction";
import { addAnnouncementRequestInterface, attachmentArrInterface, editAnnouncementRequestInterface, guestInterface } from "./AddAnnouncementInterface";
import { CustomText } from "src/component/CustomText";
import { ROUTES } from "src/navigation/Route";
import { useDispatch } from "react-redux";
import { setRsvpStatus } from "src/redux/slices/rspvSlice";
import { openSettings } from "react-native-permissions";
import Tooltip, { Placement } from 'react-native-tooltip-2';
import { useUploadFile } from "src/utils/hooks/useUploadFile";
interface AddAnnouncementScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
    params: any;
    announcementId: any
};

const AddAnnouncementScreen: React.FC<AddAnnouncementScreenProps> = ({ navigation }) => {
    const route = useRoute<RouteProp<RouteParams>>();
    const styles = AddAnnouncementStyles()
    const ticketTypeRef = useRef<any>(null);
    const addedRef = useRef<any>(null);
    const announcementRef = useRef<any>(null);
    const editPhotoBottomSheetRef = useRef<any>(null);
    const deleteBottomSheetRef = useRef<any>(null);
    const editBottomSheetRef = useRef<any>(null);
    const leaveBottomSheetRef = useRef<any>(null);
    const postBottomSheetRef = useRef<any>(null);
    const bottomSheetRef = useRef<any>(null);
    const [activeView, setActiveTab] = useState<string>('');
    const [selectedTicketType, setSelectedTicketType] = useState<any[]>([]);
    const [selectedCollaborator, setselectedCollaborator] = useState<any>([]);
    const searchInputRef = useRef<InputRefMethods>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [allRecipients, setallRecipients] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<guestInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [atachmentArr, setAttachmentArr] = useState<attachmentArrInterface[]>([]);
    const [ticketerrorMessage, setticketerrorMessage] = useState(false);
    const [recipienterrorMessage, setrecipienterrorMessage] = useState(false);
    const [addedByerrorMessage, setaddedByerrorMessage] = useState(false);
    const [ticketTypeArr, setTicketTypeArr] = useState<any[]>([]);
    const [collaboratorArr, setCollaboratorArr] = useState<any[]>([]);
    const [announcementText, setAnnouncementText] = React.useState('');
    const [totalCount, setTotalCount] = useState<any>(0)
    const { eventData, announcementId: ID } = route?.params || {};
    const [announcementId, setAnnouncementId] = React.useState(ID);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [collaborators, setCollaborators] = useState([]);
    const [showRecipientDetail, setshowRecipientDetail] = useState(true)
    const [showAnnouncementDetail, setshowAnnouncementDetail] = useState(true)
    const [showProfileToolitip, setShowProfileToolitip] = useState(false);
    const { uploadFileHook } = useUploadFile();


    const { data: announcementDetailsData } = useFetchAnnouncementDetailQuery(
        { eventId: eventData?.id, announcementId: announcementId },
        { skip: !announcementId }
    );


    const recipientQuery = {
        eventId: eventData?.id,
        announcementId,
        searchText: '',
        take: 10,
        skip: 0,
    }

    const { data: selectedRecipientData } = useFetchSelectedRecipientsQuery(
        recipientQuery,
        { skip: !announcementId }
    );


    useEffect(() => {
        if (eventData?.collaborators) {
            let collaborator = {
                ...eventData?.owner,
                name: eventData?.owner?.firstName + ' ' + eventData?.owner?.lastName,
                // id: eventData?.owner?.id,
                role: {
                    name: 'Host',
                },
            };

            // Merge the owner as a collaborator with existing collaborators
            setCollaborators([collaborator, ...eventData?.collaborators]);
        }

    }, [eventData])

    useEffect(() => {
        const backAction = () => {
            leaveAnnouncement()
            return true; // Prevents default behavior (app closing)
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove(); // Cleanup on unmount
    }, []);

    const handleBackPress = () => {
        leaveAnnouncement()
    };




    // const detailQuery = ({ eventId: eventData?.id, announcementId: announcementId } as const)

    // const { data: announcementDetailsData, isFetching: isDetailLoading } =
    //     announcementId ? useFetchAnnouncementDetailQuery(detailQuery) : { data: undefined, isFetching: false };

    // const { data: announcementDetailsData, isdetailLoading } = useFetchAnnouncementDetailQuery(detailQuery);
    useEffect(() => {
        if (announcementDetailsData != undefined) {
            setTicketTypeArr(announcementDetailsData?.data?.ticketType)
            setCollaboratorArr(announcementDetailsData?.data?.addedBy)
            setAnnouncementText(announcementDetailsData.data?.announcement);
            setAttachmentArr(announcementDetailsData?.data?.attachments)
        }
    }, [announcementDetailsData]);


    useEffect(() => {
        if (selectedRecipientData != undefined) {
            setallRecipients(selectedRecipientData?.data?.result)
        }
    }, [selectedRecipientData]);

    const ticketQueryString = selectedTicketType.map((item: any) => `ticketType=${item.id}`).join('&');
    const collaboratorQueryString = selectedCollaborator.map((item: any) => `addedBy=${item.id}`).join('&');
    const queryArgs = ({
        eventId: eventData?.id,
        ticketType: ticketQueryString,
        addedBy: collaboratorQueryString,
        searchText: searchText,
        take: 10,
        skip: (currentPage - 1) * 10,
    } as const)
    const { data: announcementRecipientsData, isLoading } = useFetchAnnouncementRecipientsQuery(queryArgs);

    useEffect(() => {
        if (announcementRecipientsData) {
            setTotalCount(announcementRecipientsData?.data?.totalCount)
            setallRecipients((prev) => (currentPage === 1 ? announcementRecipientsData?.data?.result : [...prev, ...announcementRecipientsData?.data?.result]));
        }
    }, [announcementRecipientsData]);

    useEffect(() => {
        setRefreshing(isLoading)
    }, [isLoading])

    const handleRefresh = () => {
        setCurrentPage(1)
    };

    const loadMore = () => {
        if (announcementRecipientsData?.currentPage < announcementRecipientsData?.totalPages && !isLoading) {
            setCurrentPage((prev) => prev + 1);
        }
    };



    const [createEventAnnouncement, { error: addAnnouncementError, isLoading: addAnnouncementLoading }] = useCreateEventAnnouncementMutation();

    const [deleteEventAnnouncement, { isLoading: deleteLoading, isError: deleteError, isSuccess: deleteSuccess }] = useDeleteEventAnnouncementMutation();

    const [editEventAnnouncement, { isLoading: editLoading, isError: editError, isSuccess: editSuccess }] = useEditEventAnnouncementMutation();

    const checkAnnouncement = async () => {
        if (
            announcementRef.current.validateInputs() && ticketTypeArr?.length != 0 && collaboratorArr?.length != 0 && allRecipients?.length != 0) {
            postBottomSheetRef.current?.open();
            // postAnnouncement()
        }
        else {
            ticketTypeArr?.length == 0 && setticketerrorMessage(true)
            collaboratorArr?.length == 0 && setaddedByerrorMessage(true)
            allRecipients?.length == 0 && setrecipienterrorMessage(true)
            announcementRef.current.validateInputs()
        }
    };

    const postAnnouncement = async () => {
        try {
            console.log("in try")
            const addAnnouncementRequest: addAnnouncementRequestInterface = {
                "ticketType": selectedTicketType.map((item: any) => item.id),
                "addedBy": selectedCollaborator.map((item: any) => item.id),
                "announcement": announcementRef.current.inputText,
                "attachments": atachmentArr,
                "recipients": allRecipients.map((item: any) => item.id),
            }
            const response = await createEventAnnouncement({
                eventId: eventData?.id || '',
                payload: addAnnouncementRequest,
            }).unwrap();
            if (response.success == true) {
                FlashMessageComponent.show(
                    'success',
                    `Event announcement posted`,
                );
                dispatch(setRsvpStatus("UPDATE" + Date.now()));
                navigation.goBack();
            } else {
                const typedError = response as ApiErrorInterface;
                FlashMessageComponent.show('error', getErrorMessage(typedError));
            }
        } catch (error) {
            const typedError = error as ApiErrorInterface;
            FlashMessageComponent.show('error', getErrorMessage(typedError));
        }
    };

    const renderBottomSheetContent = () => {
        switch (activeView) {
            case 'collaborator':
                return renderCollaborator();
            case 'ticketTypeOptions':
                return renderTicketTypeOptions();
            case 'receipient':
                return renderReceipient()
            default:
                return null;
        }
    };
    const getSnapPoints = (): string => {
        switch (activeView) {
            case 'collaborator':
                return collaborators.length == 1 ? `30%` : collaborators.length > 8 ? '80%' : `${(collaborators.length * 10)}%`
            case 'submit':
                return '70%';
            case 'ticketTypeOptions':
                return eventData?.ticketTypes.length == 1 ? `30%` : eventData?.ticketTypes.length > 8 ? '80%' : `${(eventData?.ticketTypes.length * 10)}%`
            case 'receipient':
                return '80 %';// : `${(allRecipients.length * 10 + 10)}%`
            default:
                return '85%';
        }
    };
    const cancelClick = () => bottomSheetRef.current?.close();
    const confirmTicketType = () => {
        if (selectedTicketType.length == 0) {
            setTicketTypeArr([])
            setticketerrorMessage(true)
        }
        else {
            setticketerrorMessage(false)
            setTicketTypeArr(selectedTicketType)
        }
        bottomSheetRef.current?.close()
    }
    const removeTicketType = (item: any) => {
        if (ticketTypeArr?.includes(item)) {
            setTicketTypeArr(ticketTypeArr?.filter((i: any) => i !== item));
        } else {
            setTicketTypeArr([...ticketTypeArr, item]);
        }
        if (selectedTicketType.includes(item)) {
            setSelectedTicketType(selectedTicketType.filter((i: any) => i !== item));
        } else {
            setSelectedTicketType([...selectedTicketType, item]);
        }
    }
    const toggleTicketType = (item: any, index: number) => {
        // if (index == 0) {
        //     setSelectedTicketType([item]);
        // }
        // else {
        if (selectedTicketType.includes(item)) {
            setSelectedTicketType(selectedTicketType.filter((i: any) => i !== item));
        } else {
            setSelectedTicketType([...selectedTicketType, item]);
        }
        // }
    }
    const renderTicketTypeOptions = () => {
        return (
            <View>
                {eventData?.ticketTypes?.map((item: any, index: number) => {
                    let isSelected = selectedTicketType.includes(item)
                    return (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.guestButton, isSelected && { borderWidth: 2, borderColor: COLORS.black, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }]}
                            onPress={() => toggleTicketType(item, index)}>
                            {isSelected && <Image source={IMAGES.check} style={{ width: 16, height: 16 }} />}
                            <Text style={styles.guestButtonText}>{item.name}</Text>
                            {isSelected && <View />}
                        </TouchableOpacity>
                    )
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
        )
    }
    const confirmCollaborator = () => {
        if (selectedCollaborator.length == 0) {
            setCollaboratorArr([])
            setaddedByerrorMessage(true)
        }
        else {
            setaddedByerrorMessage(false)
            setCollaboratorArr(selectedCollaborator)
        }
        bottomSheetRef.current?.close()
    }
    const removeCollaborator = (item: any) => {
        if (collaboratorArr?.includes(item)) {
            setCollaboratorArr(selectedCollaborator?.filter((i: any) => i !== item));
        } else {
            setCollaboratorArr([...selectedCollaborator, item]);
        }
        if (selectedCollaborator.includes(item)) {
            setselectedCollaborator(selectedCollaborator.filter((i: any) => i !== item));
        } else {
            setselectedCollaborator([...selectedCollaborator, item]);
        }
    }
    const toggleCollaborator = (item: any, index: number) => {
        // if (index == 0) {
        //     if (selectedCollaborator.includes(item)) {
        //         setselectedCollaborator([]);
        //     } else {
        //         setselectedCollaborator([item]);
        //     }
        // }
        // else {
        if (selectedCollaborator.includes(item)) {
            setselectedCollaborator(selectedCollaborator.filter((i: any) => i !== item));
        } else {
            setselectedCollaborator([...selectedCollaborator, item]);
        }
        // }
    }
    const renderCollaborator = () => {
        return (
            <View>
                {collaborators.map((item: any, index: number) => {
                    let isSelected = selectedCollaborator.includes(item)
                    return (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.guestButton, isSelected && { borderWidth: 2, borderColor: COLORS.black, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }]}
                            onPress={() => toggleCollaborator(item, index)}>
                            {isSelected && <Image source={IMAGES.check} style={{ width: 16, height: 16 }} />}
                            <Text style={styles.guestButtonText}>{item?.name + ' (' + item?.role?.name + ')'}</Text>
                            {isSelected && <View />}
                        </TouchableOpacity>
                    )
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
                    title={'cancel'}
                    colorTheme="light"
                    onPress={cancelClick}
                    clearButtonStyle={styles.clearButton}
                    textStyle={{ color: '#000' }}
                />
            </View>
        )
    }
    const handleSearchTextChange = (text: string) => {
        setCurrentPage(1);
        setSearchText(text);
    };
    const onSelectRecipient = (user: guestInterface) => {
        // const isSelected = selectedUsers.some(
        //     selectedUser => selectedUser?.id === user.id,
        // );
        // if (isSelected) {
        //     const newArray = selectedUsers.filter(u => u.id !== user.id);
        //     setSelectedUsers(newArray);
        // } else {
        //     const newArray = [...selectedUsers, user];
        //     setSelectedUsers(newArray);
        // }
    };
    const onRefreshPage = () => {
        setCurrentPage(1);
        // refetch();
    };

    const renderItem = useCallback(
        ({ item, index }: { item: guestInterface, index: number }) => {
            const isSelected = selectedUsers.some(user => user.id === item.id);
            return (
                <RecipientListItem
                    index={index}
                    item={item}
                    onSelectUser={onSelectRecipient}
                    isSelected={isSelected}
                />
            );
        },
        [selectedUsers],
    );
    const renderReceipient = () => {
        return (
            <View style={{ marginTop: verticalMarginScale(10) }}>
                <View style={styles.recipientHeader}>
                    <Text style={styles.title}>{ANNOUNCEMENT.Recipients}</Text>
                    <View style={styles.countWrapper}>
                        <Text style={[styles.label, { paddingTop: 0 }]}>{totalCount}</Text>
                    </View>
                </View>
                <SearchInput
                    ref={searchInputRef}
                    onSearchTextChange={handleSearchTextChange}
                    placeholder="Search..."
                    mainContainerStyle={{ marginVertical: verticalMarginScale(15) }}
                    defaultValue={searchText}
                />
                <FlatList
                    data={allRecipients || []}
                    style={{
                        marginBottom: verticalMarginScale(90),
                        marginTop: verticalMarginScale(5),
                    }}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ gap: verticalMarginScale(16) }}
                    ListFooterComponent={
                        <View style={{ marginBottom: verticalMarginScale(150) }} />
                    }
                    ListEmptyComponent={
                        <View
                            style={{
                                // height: verticalScale(55),
                                marginTop: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <EventEmptyRecord
                                title={searchText != '' ? ANNOUNCEMENT.No_results : ANNOUNCEMENT.No_Recipients}
                                subTitle={searchText != '' ? ANNOUNCEMENT.Please_refine_your_search : ""}
                            // isLoading={isLoading}
                            />
                        </View>
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        allRecipients?.length > 0 ? (
                            <RefreshControl refreshing={isLoading} onRefresh={onRefreshPage} />
                        ) : undefined
                    }
                />
                {/* {selectedUsers.length != 0 ? (
                    <Button
                        title="Add to List"
                        onPress={() => {
                            setSelectedRecipients(selectedUsers);
                            setrecipienterrorMessage(false)
                            cancelClick()
                        }}
                        colorTheme="dark"
                        style={{ position: 'absolute', bottom: verticalScale(0) }}
                    />
                ) : null} */}

            </View>
        )
    }
    const editPhotoClick = () => {
        editPhotoBottomSheetRef.current?.open();
    };
    const deleteAnnouncement = async () => {
        try {
            const response = await deleteEventAnnouncement({
                eventId: eventData?.id || '',
                announcementId: announcementId || '',
            }).unwrap();
            if (response.success == true) {
                FlashMessageComponent.show(
                    'success',
                    `Event announcement deleted`,
                );
                deleteBottomSheetRef.current?.close();
                dispatch(setRsvpStatus("UPDATE" + Date.now()));
                navigation.goBack();
            } else {
                const typedError = response as ApiErrorInterface;
                FlashMessageComponent.show('error', getErrorMessage(typedError));
            }
        } catch (error) {
            const typedError = error as ApiErrorInterface;
            FlashMessageComponent.show('error', getErrorMessage(typedError));
        }
    };
    const editAnnouncement = async () => {
        try {
            console.log("in try")
            const editAnnouncementRequest: editAnnouncementRequestInterface = {
                "announcement": announcementRef.current.inputText,
                "attachments": atachmentArr,
            }
            const response = await editEventAnnouncement({
                eventId: eventData?.id || '',
                announcementId: announcementId || '',
                payload: editAnnouncementRequest,
            }).unwrap();
            if (response.success == true) {
                FlashMessageComponent.show(
                    'success',
                    `Event announcement updated`,
                );
                dispatch(setRsvpStatus("UPDATE" + Date.now()));
                navigation.goBack();
            } else {
                const typedError = response as ApiErrorInterface;
                FlashMessageComponent.show('error', getErrorMessage(typedError));
            }
        } catch (error) {
            const typedError = error as ApiErrorInterface;
            FlashMessageComponent.show('error', getErrorMessage(typedError));
        }

    };
    const leaveAnnouncement = () => {
        if (
            announcementRef.current.validateInputs() && ticketTypeArr?.length != 0 && collaboratorArr?.length != 0
        ) {
            leaveBottomSheetRef.current?.open();
        }
        else {
            navigation.goBack()
        }
    }

    const openCamera = async () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            cropperCircleOverlay: false,
        }).then((image: ImageOrVideo) => {
            editPhotoBottomSheetRef.current?.close();
            savePhoto(image?.path, 'image', image?.filename, image?.size)
        }).catch(async (error) => {
            console.log('ImagePicker Error: ', error);

            if (error?.message?.includes('did not grant library permission')) {
                Alert.alert(
                    'Permission Required',
                    'We need access to your photo library to allow you to add a picture. Please enable photo library permissions in your device settings.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Open Settings',
                            onPress: async () => {
                                openSettings();
                            },
                        },
                    ]
                );
            }
        });
    };
    const pickPdf = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf], // Only allows PDFs
            });

            console.log('URI:', res[0].uri);
            console.log('Type:', res[0].type);
            console.log('Name:', res[0].name);
            console.log('Size:', res[0].size);
            if (res != null) {
                if (res[0]?.size > 5242880) {
                    FlashMessageComponent.show('error', ERROR_MESSAGE.FILE_SIZE_EXCEED);
                }
                else {
                    editPhotoBottomSheetRef.current?.close();
                    savePhoto(res[0].uri, 'pdf', res[0].name, res[0].size)
                }
            }
            else FlashMessageComponent.show('error', ERROR_MESSAGE.SOMETHING_WENT_WRONG);


        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled the picker');
            } else {
                console.error(err);
            }
        }
    };

    const onPressDelete = (uri: string) => {
        setAttachmentArr(prev => prev.filter(item => item?.media !== uri));
    };

    const removeAnnouncementId = () => {
        setAnnouncementId(null)
        setTicketTypeArr([])
        setCollaboratorArr([])
        setAnnouncementText('')
        setAttachmentArr([])
    }

    const renderAttchmentItem = ({ item }: { item: any }) => (
        <>
            {item.mediaType == 'pdf' ?
                <TouchableOpacity onPress={() => onPressDelete(item.media)} style={styles.pdfContainer}>
                    <Image source={IMAGES.pdf} style={styles.pdfIcon} resizeMode='contain' />
                    <CustomText textProps={{ numberOfLines: 2 }}>{item?.mediaName}</CustomText>
                    {/* <Text style={styles.pdfSize}>{item.size}</Text> */}
                </TouchableOpacity> :
                <ImageBackground source={{ uri: item.media }} style={styles.attachImgWrapper} imageStyle={{ borderRadius: radiusScale(8) }}>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => onPressDelete(item.media)}>
                        <Image source={IMAGES.delete} resizeMode="contain" />
                    </TouchableOpacity>
                </ImageBackground>}
        </>

    );

    const savePhoto = async (image: any, type: string, name: any, size: any) => {
        try {
            const data = await fetch(image);
            const blob = await data.blob();
            const fileName = image.split('/').pop();
            const response = await uploadFileHook(fileName, size, type, blob)
            if (response.success == true) {
                const imageUrl = environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
                let data = {
                    mediaType: type,
                    media: imageUrl,
                    mediaName: fileName,
                }
                setAttachmentArr((prev: any) => [...prev, data])
                console.log(atachmentArr, 'atachmentArr');
            } else {
                console.log('savePhoto else', response);
            }
            // const response: any = await uploadFile(image, size, type, blob);
            console.log('savePhoto', response);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Header
                headerTitle={announcementId != null ? ANNOUNCEMENT.Edit_Announcement : ANNOUNCEMENT.New_Announcement}
                onPress={handleBackPress}
                showProgressBar={false}
                rightIcon={announcementId != null ? IMAGES.plus : null}
                onPressRightIcon={removeAnnouncementId}
                rightIconWrapperStyle={{ backgroundColor: COLORS.black }}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    {!showRecipientDetail ?
                        <View style={[styles.Detailcontainer]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.headerTitle}>{ANNOUNCEMENT.Recipient_Details}</Text>
                                <TouchableOpacity onPress={() => { setshowRecipientDetail(!showRecipientDetail) }} style={styles.iconWrapper}>
                                    <Image source={IMAGES.downArrow} style={styles.downicon} />
                                </TouchableOpacity>
                            </View>
                        </View> :
                        <View style={[styles.Detailcontainer]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.headerTitle}>{ANNOUNCEMENT.Recipient_Details}</Text>
                                <TouchableOpacity onPress={() => { setshowRecipientDetail(!showRecipientDetail) }} style={styles.iconWrapper}>
                                    <Image source={IMAGES.upArrow} style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.headerDes}>{ANNOUNCEMENT.Announcement_Description}</Text>
                            <View style={styles.lineView} />
                            <View>
                                <CustomText style={[styles.label]} >
                                    {ANNOUNCEMENT.Ticket_Type}
                                    <CustomText style={{ color: COLORS.errorText }}> *</CustomText>
                                </CustomText>
                                <View style={ticketerrorMessage ? styles.errorContainer : [styles.inputContainer, { backgroundColor: announcementId != null ? COLORS.lighter_gray : '' }]}>
                                    <View ref={ticketTypeRef} style={styles.userInfoContainer}>
                                        {ticketTypeArr?.length == 0 ?
                                            <Text onPress={() => {
                                                if (announcementId == null) {
                                                    setActiveTab('ticketTypeOptions');
                                                    setSelectedTicketType(ticketTypeArr)
                                                    bottomSheetRef?.current?.open();
                                                }
                                            }} style={[styles.inputStyle, { left: 0 }]}>Please select...</Text>
                                            :
                                            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ marginVertical: verticalMarginScale(10), width: '100%' }}>
                                                {ticketTypeArr?.map((item: any) => {
                                                    return (
                                                        <View style={[styles.countWrapper, {
                                                            marginHorizontal: 3, paddingVertical: verticalScale(3), flexDirection: 'row'
                                                        }]}>
                                                            <Text style={[styles.label, { paddingTop: 0 }]}>{item?.name}</Text>
                                                            {announcementId == null &&
                                                                <TouchableOpacity onPress={() => removeTicketType(item)}>
                                                                    <Image source={IMAGES.cross} style={{ left: 5 }} />
                                                                </TouchableOpacity>
                                                            }
                                                        </View>
                                                    )
                                                })
                                                }
                                            </ScrollView>
                                        }
                                    </View>
                                    <TouchableOpacity style={{ width: '8%', alignItems: 'flex-end', justifyContent: 'flex-end', paddingVertical: '5%' }} onPress={() => {
                                        if (announcementId == null) {
                                            setActiveTab('ticketTypeOptions');
                                            setSelectedTicketType(ticketTypeArr)
                                            bottomSheetRef?.current?.open();
                                        }
                                    }}>
                                        <Image
                                            style={styles.arrowicon}
                                            source={IMAGES.downArrow}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {ticketerrorMessage ? (
                                    <Text style={[styles.errorText]}>{ERROR_MESSAGE.TICKET_TYPE_ERROR}</Text>
                                ) : null}
                            </View>

                            <View>
                                <CustomText style={[styles.label]} >
                                    {ANNOUNCEMENT.Added_by}
                                    <CustomText style={{ color: COLORS.errorText }}> *</CustomText>
                                    <TouchableOpacity
                                        onPress={() => setShowProfileToolitip(!showProfileToolitip)}>
                                        <Image style={{ marginTop: 25, left: 5 }} tintColor={COLORS.light_gray} source={IMAGES.info_filled} />
                                    </TouchableOpacity>
                                </CustomText>
                                <Tooltip
                                    contentStyle={[styles.toolTipStyle, {
                                        height: verticalScale(90),
                                    }]}
                                    isVisible={showProfileToolitip}
                                    displayInsets={{
                                        left: 0,
                                        right: 270,
                                        top: 0,
                                        bottom: 0
                                    }}
                                    arrowStyle={{ left: -10 }}
                                    backgroundColor='transparent'
                                    topAdjustment={verticalScale(-10)}
                                    content={
                                        <View>
                                            <Text style={styles.tooltipHeadStyle}>{ANNOUNCEMENT.ANNOUNCEMENT_TOOLTIP}</Text>
                                        </View>
                                    }
                                    placement={Placement.RIGHT}
                                    onClose={() => setShowProfileToolitip(false)}
                                >
                                    <View />
                                </Tooltip>
                                <View style={addedByerrorMessage ? styles.errorContainer : [styles.inputContainer, { backgroundColor: announcementId != null ? COLORS.lighter_gray : '' }]}>
                                    <View ref={addedRef} style={styles.userInfoContainer}>
                                        {collaboratorArr?.length == 0 ?
                                            <Text onPress={() => {
                                                if (announcementId == null) {
                                                    setActiveTab('collaborator');
                                                    setselectedCollaborator(collaboratorArr)
                                                    bottomSheetRef?.current?.open();
                                                }
                                            }} style={[styles.inputStyle, { left: 0 }]}>Please select...</Text>
                                            :
                                            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ marginVertical: verticalMarginScale(10) }}>
                                                {collaboratorArr?.map((item: any) => {
                                                    return (
                                                        <View style={[styles.countWrapper, {
                                                            marginHorizontal: 3, paddingVertical: verticalScale(3), flexDirection: 'row'
                                                        }]}>
                                                            <Text style={[styles.label, { paddingTop: 0 }]}>{announcementId == null ? item?.name : item?.firstName + ' ' + item?.lastName}</Text>
                                                            {announcementId == null &&
                                                                <TouchableOpacity onPress={() => removeCollaborator(item)}>
                                                                    <Image source={IMAGES.cross} style={{ left: 5 }} />

                                                                </TouchableOpacity>
                                                            }
                                                        </View>
                                                    )
                                                })
                                                }
                                            </ScrollView>
                                        }
                                    </View>
                                    <TouchableOpacity style={{ width: '8%', alignItems: 'flex-end', justifyContent: 'flex-end', paddingVertical: '5%' }} onPress={() => {
                                        if (announcementId == null) {
                                            setActiveTab('collaborator');
                                            setselectedCollaborator(collaboratorArr)
                                            bottomSheetRef?.current?.open();
                                        }
                                    }}>
                                        <Image
                                            style={styles.arrowicon}
                                            source={IMAGES.downArrow}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {addedByerrorMessage ? (
                                    <Text style={[styles.errorText]}>{ERROR_MESSAGE.COLLABORATOR_ERROR}</Text>
                                ) : null}
                            </View>

                            <View>
                                <Text style={styles.label}>{ANNOUNCEMENT.Send_to}</Text>
                                <TouchableOpacity onPress={() => {
                                    if (announcementId == null) {
                                        setActiveTab('receipient')
                                        bottomSheetRef?.current?.open()
                                    }
                                }} style={recipienterrorMessage ? styles.errorContainer : [styles.inputContainer, { backgroundColor: announcementId != null ? COLORS.lighter_gray : '' }]}>
                                    <View style={styles.userInfoContainer}>
                                        {allRecipients?.length == 0 ?
                                            <View style={styles.recipintWrapper} />
                                            :
                                            <FlatList
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                data={allRecipients}
                                                renderItem={({ item, index }) => {
                                                    const name = announcementId == null ? item?.user?.firstName + ' ' + item?.user?.lastName : item?.firstName + ' ' + item?.lastName
                                                    const profilePicture = announcementId == null ? item?.user?.profilePicture : item?.profilePicture
                                                    return (
                                                        <View>
                                                            {index < 3 ? <View style={[styles.receipientImg, { left: index * -15 }]}>
                                                                <AvatarInitials
                                                                    name={name}
                                                                    imgUrl={profilePicture}
                                                                    size={30}
                                                                    textColor="white"
                                                                />
                                                            </View>
                                                                : null}
                                                        </View>
                                                    )
                                                }
                                                }
                                            />
                                        }
                                        <View style={{ alignItems: 'center', justifyContent: 'center', left: allRecipients.length == 1 ? horizontalScale(-160) : allRecipients.length == 2 ? horizontalScale(-140) : allRecipients.length >= 3 ? horizontalScale(-120) : horizontalScale(10) }}>
                                            <Text style={[styles.label, { paddingTop: 0 }]}>{ANNOUNCEMENT.Recipients}</Text>
                                            <Text style={styles.attachDes}>{allRecipients.length} Users</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        if (announcementId == null) {
                                            setActiveTab('receipient')
                                            bottomSheetRef?.current?.open()
                                        }
                                    }}>
                                        <Image
                                            source={IMAGES.arrowRight}
                                        />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                {recipienterrorMessage ? (
                                    <Text style={[styles.errorText]}>{ERROR_MESSAGE.RECIPIENTS_ERROR}</Text>
                                ) : null}
                            </View>

                        </View>
                    }
                    {!showAnnouncementDetail ?
                        <View style={[styles.Detailcontainer]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.headerTitle}>{ANNOUNCEMENT.Announcement_Details}</Text>
                                <TouchableOpacity onPress={() => { setshowAnnouncementDetail(!showAnnouncementDetail) }} style={styles.iconWrapper}>
                                    <Image source={IMAGES.downArrow} style={styles.downicon} />
                                </TouchableOpacity>
                            </View>
                        </View> :
                        <View style={[styles.Detailcontainer]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.headerTitle}>{ANNOUNCEMENT.Announcement_Details}</Text>
                                <TouchableOpacity onPress={() => { setshowAnnouncementDetail(!showAnnouncementDetail) }} style={styles.iconWrapper}>
                                    <Image source={IMAGES.upArrow} style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.lineView} />
                            <Input
                                editable={true}
                                isRequired={true}
                                multiline={true}
                                ref={announcementRef}
                                placeholder={ANNOUNCEMENT.Share_updates}
                                defaultValue={announcementText}
                                onChangeText={setAnnouncementText}
                                label={ANNOUNCEMENT.Announcement}
                                errorMessage={ERROR_MESSAGE.ANNOUNCEMENT_DETAIL_ERROR} />
                            <Text style={styles.label}>{ANNOUNCEMENT.Attachments}</Text>

                            <View style={{ flexDirection: 'row' }}>
                                {atachmentArr.length < 3 &&
                                    <TouchableOpacity onPress={() => editPhotoClick()} style={styles.attachWrapper}>
                                        <Image source={IMAGES.upload} style={styles.icon} />
                                    </TouchableOpacity>
                                }
                                <FlatList
                                    data={atachmentArr}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={renderAttchmentItem}
                                />
                            </View>
                            <Text style={styles.attachDescription}>{ANNOUNCEMENT.Attachments_Descripiton}</Text>

                        </View>
                    }
                </View>
            </ScrollView>
            {announcementId != null ?
                <>
                    <Button
                        disabled={false}
                        style={styles.btnStyle}
                        title={ANNOUNCEMENT.Delete}
                        colorTheme="red"
                        onPress={() => deleteBottomSheetRef.current?.open()}
                    />
                    <Button
                        disabled={false}
                        style={[styles.btnStyle, {
                            marginTop: verticalMarginScale(10),
                        }]}
                        title={ANNOUNCEMENT.Update_Announcement}
                        colorTheme="dark"
                        onPress={() => editBottomSheetRef.current?.open()}
                    />
                </> :
                <Button
                    disabled={false}
                    style={styles.btnStyle}
                    title={ANNOUNCEMENT.Post_Announcement}
                    colorTheme="dark"
                    onPress={checkAnnouncement}
                />
            }

            <BottomSheetComponent
                ref={bottomSheetRef}
                onClose={() => { bottomSheetRef?.current?.close() }}
                snapPoints={[getSnapPoints()]}>
                <View style={styles.bottomSheetContent}>
                    {renderBottomSheetContent()}
                </View>
            </BottomSheetComponent>

            <DocumentBottomSheet
                ref={editPhotoBottomSheetRef}
                onPhotoClick={openCamera}
                onFileClick={pickPdf}
                title={ANNOUNCEMENT.Choose_Document}
                fileButtonText={ANNOUNCEMENT.Choose_from_file}
                photoButtonText={ANNOUNCEMENT.Choose_photo_or_video}
                snapPoints={['30%']}
                image={null}
            />
            <ConfirmationBottomSheet
                ref={deleteBottomSheetRef}
                title={ANNOUNCEMENT.Delete_Event_Announcement}
                subTitle={ANNOUNCEMENT.delete_text}
                isAnnouncement={true}
                snapPoints={['0.35']}
                colorTheme={'red'}
                btnLabel={ANNOUNCEMENT.Delete}
                back={deleteAnnouncement} />

            <ConfirmationBottomSheet
                ref={editBottomSheetRef}
                isAnnouncement={true}
                snapPoints={['0.35']}
                title={ANNOUNCEMENT.Update_Event_Announcement}
                subTitle={ANNOUNCEMENT.update_text}
                btnLabel={ANNOUNCEMENT.Update_Announcement}
                back={editAnnouncement}
            />

            <ConfirmationBottomSheet
                ref={leaveBottomSheetRef}
                isAnnouncement={true}
                snapPoints={['0.35']}
                title={ANNOUNCEMENT.leave_title}
                subTitle={ANNOUNCEMENT.leave_text}
                btnLabel={ANNOUNCEMENT.Leave_Without_Saving}
                back={() => navigation.goBack()}
            />

            <ConfirmationBottomSheet
                ref={postBottomSheetRef}
                isAnnouncement={true}
                snapPoints={['0.30']}
                title={ANNOUNCEMENT.Post_Announcement}
                subTitle={ANNOUNCEMENT.announcement_des + allRecipients.length + ' recipients'}
                btnLabel={ANNOUNCEMENT.Post_Announcement}
                back={() => postAnnouncement()}
            />
        </View>
    )
}

export default AddAnnouncementScreen;