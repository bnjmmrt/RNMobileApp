import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, BackHandler, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import { useCreateEventAnnouncementMutation, useFetchAnnouncementRecipientsQuery } from "src/redux/actions/eventApiAction";
import { addAnnouncementRequestInterface, attachmentArrInterface, guestInterface } from "./AddAnnouncementInterface";

interface AddAnnouncementScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
    params: any;
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
    const { goBack, navigate } = useNavigation()
    const [selectedTicketType, setSelectedTicketType] = useState<any[]>([]);
    const [selectedCollaborator, setselectedCollaborator] = useState<any>([]);
    const [image, setImage] = useState<string>('');
    const { apiRequest, loading } = useApi();
    const searchInputRef = useRef<InputRefMethods>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [allRecipients, setallRecipients] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<guestInterface[]>([]);
    const [selectedRecipients, setSelectedRecipients] = useState<guestInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [atachmentArr, setAttachmentArr] = useState<attachmentArrInterface[]>([]);
    const announcementId = null
    const [ticketerrorMessage, setticketerrorMessage] = useState(false);
    const [addedByerrorMessage, setaddedByerrorMessage] = useState(false);
    const [ticketTypeArr, setTicketTypeArr] = useState<any[]>([]);
    const [collaboratorArr, setCollaboratorArr] = useState<any[]>([]);

    const eventData = route?.params
    console.log("eventData", eventData?.id)

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

    const queryArgs = ({ eventId: eventData?.id, ticketType: selectedTicketType.map((item: any) => item.id), addedBy: selectedCollaborator.map((item: any) => item.id), } as const)
    console.log("queryArgs", queryArgs)
    const { data: announcementRecipientsData, isLoading } = useFetchAnnouncementRecipientsQuery(queryArgs);

    console.log("announcementRecipientsData", announcementRecipientsData)

    useEffect(() => {
        if (announcementRecipientsData != undefined) {
            setallRecipients(announcementRecipientsData?.data);
        }
    }, [announcementRecipientsData]);

    const [
        createEventAnnouncement,
        { error: addAnnouncementError, isLoading: addAnnouncementLoading },
    ] = useCreateEventAnnouncementMutation();

    const checkAnnouncement = async () => {
        if (
            announcementRef.current.validateInputs() && selectedTicketType.length != 0 && collaboratorArr.length != 0
        ) {
            postBottomSheetRef.current?.open();
        }
        else {
            setticketerrorMessage(true)
            setaddedByerrorMessage(true)
        }
    };

    const postAnnouncement = async () => {
        console.log("in postAnnouncement")

        try {
            console.log("in try")
            const addAnnouncementRequest: addAnnouncementRequestInterface = {
                "ticketType": selectedTicketType.map((item: any) => item.id),
                "addedBy": selectedCollaborator.map((item: any) => item.id),
                "announcement": announcementRef.current.inputText,
                "attachments": atachmentArr.map((item: any) => item.uri),
                "recipients": selectedUsers.map((item: any) => item.id),
            }
            const response = await createEventAnnouncement({
                eventId: eventData?.id || '',
                payload: addAnnouncementRequest,
            }).unwrap();
            console.log("in response", response)

            if (response.statusCode === 201) {
                FlashMessageComponent.show(
                    'success',
                    `Event announcement posted`,
                );
                // setSelectedRecipients([])
                // setSelectedTicketType([])
                // setselectedCollaborator([])
                navigation.goBack();
            } else {
                const typedError = response as ApiErrorInterface;
                FlashMessageComponent.show('error', getErrorMessage(typedError));
            }
        } catch (error) {
            console.log("in catch", error)
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
                return '50%';
            case 'submit':
                return '70%';
            case 'ticketTypeOptions':
                return '55%';
            case 'receipient':
                return allRecipients?.length == 0 ? '50%' : '85%';
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
                    title={'cancel'}
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
                {eventData?.collaborators.map((item: any, index: number) => {
                    let isSelected = selectedCollaborator.includes(item)
                    return (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.guestButton, isSelected && { borderWidth: 2, borderColor: COLORS.black, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }]}
                            onPress={() => toggleCollaborator(item, index)}>
                            {isSelected && <Image source={IMAGES.check} style={{ width: 16, height: 16 }} />}
                            <Text style={styles.guestButtonText}>{item?.role?.name}</Text>
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
        const isSelected = selectedUsers.some(
            selectedUser => selectedUser.id === user.id,
        );
        if (isSelected) {
            const newArray = selectedUsers.filter(u => u.id !== user.id);
            setSelectedUsers(newArray);
        } else {
            const newArray = [...selectedUsers, user];
            setSelectedUsers(newArray);
        }
    };
    const onRefreshPage = () => {
        setCurrentPage(1);
        refetch();
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
                        <Text style={[styles.label, { paddingTop: 0 }]}>{allRecipients?.length}</Text>
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
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <EventEmptyRecord
                                title={ANNOUNCEMENT.No_results}
                                // subTitle={ANNOUNCEMENT.Please_refine_your_search}
                                isLoading={isLoading}
                            />
                        </View>
                    }
                // onEndReached={loadMore}
                // onEndReachedThreshold={0.4}
                // showsVerticalScrollIndicator={false}
                // refreshControl={
                //     allRecipients?.users?.length > 0 ? (
                //         <RefreshControl refreshing={isLoading} onRefresh={onRefreshPage} />
                //     ) : undefined
                // }
                />
                {selectedUsers.length != 0 ? (
                    <Button
                        title="Add to List"
                        onPress={() => {
                            setSelectedRecipients(selectedUsers);
                            cancelClick()
                        }}
                        colorTheme="dark"
                        style={{ position: 'absolute', bottom: verticalScale(0) }}
                    />
                ) : null}

            </View>
        )
    }
    const editPhotoClick = () => {
        editPhotoBottomSheetRef.current?.open();
    };
    const deleteAnnouncement = () => {
        deleteBottomSheetRef.current?.open();
    };
    const editAnnouncement = () => {
        editBottomSheetRef.current?.open();
    };
    const leaveAnnouncement = () => {
        if (
            announcementRef.current.validateInputs() && ticketTypeArr.length != 0 && collaboratorArr.length != 0
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
            cropperCircleOverlay: true,
        }).then((image: ImageOrVideo) => {
            editPhotoBottomSheetRef.current?.close();
            savePhoto(image.path)
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
                    let data = {
                        type: 'file',
                        uri: res[0].uri,
                        name: res[0].name,
                        thumbnail: ''
                    }
                    setAttachmentArr((prev: any) => [...prev, data])
                    editPhotoBottomSheetRef.current?.close();
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
    const uploadFile = async (image: string) => {
        const mimeType = `images/${image.split('.').pop()}`;
        const fileName = image.split('/').pop();

        const formData = new FormData();
        formData.append('file', {
            uri: image,
            type: mimeType,
            name: fileName,
        });

        return await apiRequest('post', EndPoint.file_upload, formData, null, {
            'Content-Type': 'multipart/form-data',
        });
    };

    const onPressDelete = (uri: string) => {
        setAttachmentArr(prev => prev.filter(item => item?.uri !== uri));
    };

    const renderAttchmentItem = ({ item }: { item: any }) => (
        <ImageBackground source={item.type == 'file' ? IMAGES.eventCoverPlaceholders : { uri: item.uri }} style={styles.attachImgWrapper} imageStyle={{ borderRadius: radiusScale(8) }}>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => onPressDelete(item.uri)}>
                <Image source={IMAGES.delete} resizeMode="contain" />
            </TouchableOpacity>
        </ImageBackground>
    );

    const savePhoto = async (image: any) => {
        if (image) {
            const response: any = await uploadFile(image);
            console.log('savePhoto', response);
            if (response.status === 200) {
                const imageUrl =
                    environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
                let data = {
                    type: 'photo',
                    uri: imageUrl,
                    name: '',
                    thumbnail: ''
                }
                setAttachmentArr((prev: any) => [...prev, data])

            } else {
                console.log('savePhoto else', response);
            }
        }
    };
    return (
        <View style={styles.container}>
            <Header
                headerTitle={ANNOUNCEMENT.New_Announcement}
                onPress={handleBackPress}
                showProgressBar={false}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <View style={[styles.Detailcontainer]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.headerTitle}>{ANNOUNCEMENT.Recipient_Details}</Text>
                            <View style={styles.iconWrapper}>
                                <Image source={IMAGES.upArrow} style={styles.icon} />
                            </View>
                        </View>
                        <Text style={styles.headerDes}>{ANNOUNCEMENT.Announcement_Description}</Text>
                        <View style={styles.lineView} />
                        <View>
                            <Text style={styles.label}>{ANNOUNCEMENT.Ticket_Type}</Text>
                            <View style={ticketerrorMessage ? styles.errorContainer : styles.inputContainer}>
                                <View ref={ticketTypeRef} style={styles.userInfoContainer}>
                                    {ticketTypeArr.length == 0 ?
                                        <Text style={[styles.inputStyle, { left: 0 }]}>Please Select...</Text>
                                        :
                                        <ScrollView horizontal={true} style={{ marginVertical: verticalMarginScale(10) }}>
                                            {ticketTypeArr.map((item: any) => {
                                                console.log(item.label)
                                                return (
                                                    <View style={[styles.countWrapper, {
                                                        marginHorizontal: 3, backgroundColor: 'transparant', paddingVertical: verticalScale(3),
                                                    }]}>
                                                        <Text style={[styles.label, { paddingTop: 0 }]}>{item.name}</Text>
                                                    </View>
                                                )
                                            })
                                            }
                                        </ScrollView>
                                    }
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setActiveTab('ticketTypeOptions');
                                    bottomSheetRef?.current?.open();
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
                            <Text style={styles.label}>{ANNOUNCEMENT.Added_by}</Text>
                            <View style={addedByerrorMessage ? styles.errorContainer : styles.inputContainer}>
                                <View ref={addedRef} style={styles.userInfoContainer}>
                                    {collaboratorArr.length == 0 ?
                                        <Text style={[styles.inputStyle, { left: 0 }]}>Please Select...</Text>
                                        :
                                        <ScrollView horizontal={true} style={{ marginVertical: verticalMarginScale(10) }}>
                                            {collaboratorArr.map((item: any) => {
                                                return (
                                                    <View style={[styles.countWrapper, {
                                                        marginHorizontal: 3, backgroundColor: 'transparant', paddingVertical: verticalScale(3),
                                                    }]}>
                                                        <Text style={[styles.label, { paddingTop: 0 }]}>{item?.role?.name}</Text>
                                                    </View>
                                                )
                                            })
                                            }
                                        </ScrollView>
                                    }
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setActiveTab('collaborator');
                                    bottomSheetRef?.current?.open();
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
                            <View style={styles.inputContainer}>
                                <View style={styles.userInfoContainer}>
                                    {selectedUsers.length == 0 ?
                                        <View style={styles.recipintWrapper} />
                                        :
                                        <FlatList
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            data={selectedUsers}
                                            renderItem={({ item, index }) => {
                                                const name = item?.user?.firstName + ' ' + item?.user?.lastName
                                                return (
                                                    <View>
                                                        {index < 3 ? <View style={[styles.receipientImg, { left: index * -15 }]}>
                                                            <AvatarInitials
                                                                name={name}
                                                                imgUrl={item?.user?.profilePicture}
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
                                    <View style={{ alignItems: 'center', justifyContent: 'center', left: selectedUsers.length > 0 ? horizontalScale(-110) : horizontalScale(10) }}>
                                        <Text style={[styles.label, { paddingTop: 0 }]}>{ANNOUNCEMENT.Recipients}</Text>
                                        <Text style={styles.attachDes}>{selectedUsers.length} Users</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setActiveTab('receipient')
                                    bottomSheetRef?.current?.open()
                                }}>
                                    <Image
                                        source={IMAGES.arrowRight}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

                    <View style={[styles.Detailcontainer]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.headerTitle}>{ANNOUNCEMENT.Announcement_Details}</Text>
                            <View style={styles.iconWrapper}>
                                <Image source={IMAGES.upArrow} style={styles.icon} />
                            </View>
                        </View>
                        <View style={styles.lineView} />
                        <Input
                            editable={true}
                            isRequired={true}
                            multiline={true}
                            ref={announcementRef}
                            placeholder={ANNOUNCEMENT.Share_updates}
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
                </View>
            </ScrollView>
            {announcementId != null ?
                <>
                    <Button
                        disabled={false}
                        style={styles.btnStyle}
                        title={ANNOUNCEMENT.Delete}
                        colorTheme="red"
                        onPress={deleteAnnouncement}
                    />
                    <Button
                        disabled={false}
                        style={[styles.btnStyle, {
                            marginTop: verticalMarginScale(10),
                        }]}
                        title={ANNOUNCEMENT.Update_Announcement}
                        colorTheme="dark"
                        onPress={editAnnouncement}
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
                snapPoints={['35%']}
                colorTheme={'red'}
                btnLabel={ANNOUNCEMENT.Delete}
                back={() => navigation.goBack()} />

            <ConfirmationBottomSheet
                ref={editBottomSheetRef}
                isAnnouncement={true}
                snapPoints={['35%']}
                title={ANNOUNCEMENT.Update_Event_Announcement}
                subTitle={ANNOUNCEMENT.update_text}
                btnLabel={ANNOUNCEMENT.Update_Announcement} />

            <ConfirmationBottomSheet
                ref={leaveBottomSheetRef}
                isAnnouncement={true}
                snapPoints={['35%']}
                title={ANNOUNCEMENT.leave_title}
                subTitle={ANNOUNCEMENT.leave_text}
                btnLabel={ANNOUNCEMENT.Leave_Without_Saving}
                back={() => navigation.goBack()}
            />

            <ConfirmationBottomSheet
                ref={postBottomSheetRef}
                isAnnouncement={true}
                snapPoints={['30%']}
                title={ANNOUNCEMENT.Post_Announcement}
                subTitle={ANNOUNCEMENT.announcement_des}
                btnLabel={ANNOUNCEMENT.Post_Announcement}
                back={() => postAnnouncement()}
            />
        </View>
    )
}

export default AddAnnouncementScreen;