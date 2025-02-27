import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, BackHandler, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "src/component/Header/Header";
import { ANNOUNCEMENT, collaboratorList, COLORS, ERROR_MESSAGE, ticketTypeList } from "src/utils/constants";
import Input, { InputRefMethods } from "src/component/Input/Input";
import IMAGES from "@images/index";
import BottomSheetComponent from "src/component/BottomSheet/BottomSheet";
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from "src/utils/dimensions";
import { useNavigation } from "@react-navigation/native";
import Button from "src/component/Button";
import EditPictureBottomSheet from "src/component/BottomSheet/EditPictureBottomSheet";
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import useApi from "src/axios/useApi";
import { EndPoint } from "src/ApiManager/config";
import { environment } from "environments/environment";
import SearchInput from "src/component/SearchInput";
import RecipientListItem, { RecipientItemInterface } from "./RecipientListItem";
import EventEmptyRecord from "src/component/EmptyRecord/EventEmptyRecord";
import { useFetchAllUsersQuery } from "src/redux/actions/usersApiAction";
import AvatarInitials from "src/component/AvatarInitials";
import { fontFamily } from "src/utils/functions";
import { constant } from "lodash";
import DocumentBottomSheet from "src/component/BottomSheet/DocumentBottomSheet";
import DocumentPicker from 'react-native-document-picker';
import { FlashMessageComponent } from "src/component/FlashMessageComponent/FlashMessageComponent";
import AddAnnouncementStyles from "./AddAnnouncementStyles";
import ConfirmationBottomSheet from "src/component/BottomSheet/ConfirmationBottomSheet";

interface AddAnnouncementScreenProps extends NativeStackScreenProps<any, any> { }
interface attachmentArrInterface {
    type: string,
    uri: string,
    name: string
}
const AddAnnouncementScreen: React.FC<AddAnnouncementScreenProps> = ({ navigation }) => {
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
    const [selectedTicketType, setSelectedTicketType] = useState<any>([]);
    const [selectedCollaborator, setselectedCollaborator] = useState<any>([]);
    const [image, setImage] = useState<string>('');
    const { apiRequest, loading } = useApi();
    const searchInputRef = useRef<InputRefMethods>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [allRecipients, setallRecipients] = useState<{
        users: RecipientItemInterface[];
        totalCount: number;
    }>({ totalCount: 0, users: [] });
    const [selectedUsers, setSelectedUsers] = useState<RecipientItemInterface[]>([]);
    const [selectedRecipients, setSelectedRecipients] = useState<RecipientItemInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [atachmentArr, setAttachmentArr] = useState<attachmentArrInterface[]>([]);
    const announcementId = null
    const [ticketerrorMessage, setticketerrorMessage] = useState(false);
    const [addedByerrorMessage, setaddedByerrorMessage] = useState(false);
    const [ticketTypeArr, setTicketTypeArr] = useState<any[]>([]);
    const [collaboratorArr, setCollaboratorArr] = useState<any[]>([]);

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
    const renderBottomSheetContent = () => {
        switch (activeView) {
            case 'submit':
                return null
            case 'collaborator':
                return renderCollaborator();
            case 'vouch':
                return null
            case 'ticketTypeOptions':
                return renderTicketTypeOptions();
            case 'receipient':
                return renderReceipient()
            case 'leave':
                return null
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
                return allRecipients.users.length == 0 ? '55%' : '85%';
            case 'leave':
                return '40%';
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
        if (index == 0) {
            setSelectedTicketType([item]);
        }
        else {
            if (selectedTicketType.includes(item)) {
                setSelectedTicketType(selectedTicketType.filter((i: any) => i !== item));
            } else {
                setSelectedTicketType([...selectedTicketType, item]);
            }
        }
    }
    const renderTicketTypeOptions = () => {
        return (
            <View>
                {ticketTypeList.map((item, index) => {
                    let isSelected = selectedTicketType.includes(item)
                    return (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.guestButton, isSelected && { borderWidth: 2, borderColor: COLORS.black, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }]}
                            onPress={() => toggleTicketType(item, index)}>
                            {isSelected && <Image source={IMAGES.check} style={{ width: 16, height: 16 }} />}
                            <Text style={styles.guestButtonText}>{item.label}</Text>
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
        if (index == 0) {
            if (selectedCollaborator.includes(item)) {
                setselectedCollaborator([]);
            } else {
                setselectedCollaborator([item]);
            }
        }
        else {
            if (selectedCollaborator.includes(item)) {
                setselectedCollaborator(selectedCollaborator.filter((i: any) => i !== item));
            } else {
                setselectedCollaborator([...selectedCollaborator, item]);
            }
        }
    }
    const renderCollaborator = () => {
        return (
            <View>
                {collaboratorList.map((item, index) => {
                    let isSelected = selectedCollaborator.includes(item)
                    return (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.guestButton, isSelected && { borderWidth: 2, borderColor: COLORS.black, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }]}
                            onPress={() => toggleCollaborator(item, index)}>
                            {isSelected && <Image source={IMAGES.check} style={{ width: 16, height: 16 }} />}
                            <Text style={styles.guestButtonText}>{item.label}</Text>
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
    const postAnnouncement = async () => {
        if (
            announcementRef.current.validateInputs() && ticketTypeArr.length != 0 && collaboratorArr.length != 0
        ) {
            postBottomSheetRef.current?.open();
        }
        else {
            setticketerrorMessage(true)
            setaddedByerrorMessage(true)
        }
    };
    const handleSearchTextChange = (text: string) => {
        setCurrentPage(1);
        setSearchText(text);
    };
    const onSelectRecipient = (user: RecipientItemInterface) => {
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
    const { data, isLoading, error, isError, refetch } = useFetchAllUsersQuery({
        take: 10,
        skip: (currentPage - 1) * 10,
        searchValue: searchText,
        queryString: filterQuery,
    });
    const onRefreshPage = () => {
        setCurrentPage(1);
        refetch();
    };
    const loadMore = () => {
        if (allRecipients?.users?.length < data?.data?.totalCount && !isLoading) {
            setCurrentPage(prev => prev + 1);
        }
    };
    useEffect(() => {
        if (data && data.data) {
            if (currentPage === 1) {
                setallRecipients(data.data);
            } else {
                setallRecipients(prev => ({
                    totalCount: data.data.totalCount,
                    users: [...prev.users, ...data.data.users],
                }));
            }
        }
    }, [data]);
    const renderItem = useCallback(
        ({ item, index }: { item: RecipientItemInterface, index: number }) => {
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
                        <Text style={[styles.label, { paddingTop: 0 }]}>{allRecipients.totalCount}</Text>
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
                    data={allRecipients?.users || []}
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
                                subTitle={ANNOUNCEMENT.Please_refine_your_search}
                                isLoading={false}
                            />
                        </View>
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        allRecipients?.users?.length > 0 ? (
                            <RefreshControl refreshing={isLoading} onRefresh={onRefreshPage} />
                        ) : undefined
                    }
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
        leaveBottomSheetRef.current?.open();
    }

    const openCamera = async () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            cropperCircleOverlay: true,
        }).then((image: ImageOrVideo) => {
            editPhotoBottomSheetRef.current?.close();
            let data = {
                type: 'photo',
                uri: image.path,
                name: ''
            }
            setAttachmentArr((prev: any) => [...prev, data])
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
                        name: res[0].name
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
    const uploadFile = async () => {
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
            // setIsToastShown(false);
            // const response: any = await uploadFile();
            // console.log('savePhoto', response);
            // if (response.status === 200) {
            //     // setIsToastShown(false);
            //     const imageUrl =
            //         environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
            //     // await updateProfilePhoto(imageUrl)

            // } else {
            //     //display error
            // }
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
                        {/* <Input
                            inputFieldContainerStyle={{ height: verticalScale(48) }}
                            editable={false}
                            isRequired={true}
                            ref={ticketTypeRef}
                            rightImage={IMAGES.downArrow}
                            placeholder={'Please Select...'}
                            label={ANNOUNCEMENT.Ticket_Type}
                            onPressImage={() => {
                                setActiveTab('ticketTypeOptions');
                                bottomSheetRef?.current?.open();
                            }} errorMessage={ERROR_MESSAGE.TICKET_TYPE_ERROR} />
                        <Input
                            inputFieldContainerStyle={{ height: verticalScale(48) }}
                            editable={false}
                            isRequired={true}
                            ref={addedRef}
                            rightImage={IMAGES.downArrow}
                            placeholder={'Please Select...'}
                            label={ANNOUNCEMENT.Added_by}
                            onPressImage={() => {
                                setActiveTab('collaborator');
                                bottomSheetRef?.current?.open();
                            }}
                            errorMessage={ERROR_MESSAGE.TICKET_TYPE_ERROR} /> */}

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
                                                        <Text style={[styles.label, { paddingTop: 0 }]}>{item.label}</Text>
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
                                                        <Text style={[styles.label, { paddingTop: 0 }]}>{item.label}</Text>
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
                                                return (
                                                    <View>
                                                        {index < 3 ? <View style={[styles.receipientImg, { left: index * -15 }]}>
                                                            <AvatarInitials
                                                                name={item.name}
                                                                imgUrl={item.profilePicture}
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
                    onPress={postAnnouncement}
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
                back={() => navigation.goBack()}
            />
        </View>
    )
}

export default AddAnnouncementScreen;