import IMAGES from '@images/index';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { environment } from 'environments/environment';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { openSettings } from 'react-native-permissions';
import { useDispatch } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import ConfirmationBottomSheet from 'src/component/BottomSheet/ConfirmationBottomSheet';
import DocumentBottomSheet from 'src/component/BottomSheet/DocumentBottomSheet';
import Button from 'src/component/Button';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Header from 'src/component/Header/Header';
import { InputRefMethods } from 'src/component/Input/Input';
import {
  useCreateEventAnnouncementMutation,
  useDeleteEventAnnouncementMutation,
  useEditEventAnnouncementMutation,
  useFetchAnnouncementDetailQuery,
  useFetchSelectedRecipientsQuery,
} from 'src/redux/actions/eventApiAction';
import { setRsvpStatus } from 'src/redux/slices/rspvSlice';
import { ANNOUNCEMENT, BUTTON_LABLE, COLORS, ERROR_MESSAGE, PERMISSION, MAX_IMAGE_SIZE_BYTES } from 'src/utils/constants';
import { verticalMarginScale } from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { useUploadFile } from 'src/utils/hooks/useUploadFile';
import {
  addAnnouncementRequestInterface,
  attachmentArrInterface,
  editAnnouncementRequestInterface,
  guestInterface,
} from './AddAnnouncementInterface';
import AddAnnouncementStyles from './AddAnnouncementStyles';
import { TicketType } from '../TicketType';
import { Collaborator } from '../Collaborator';
import { Recipient } from '../Recipient';
import { RecipientDetail } from '../RecipientDetail';
import { AnnouncementDetail } from '../AnnouncementDetail';

interface AddAnnouncementScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
  params: any;
  announcementId: any;
};

const AddAnnouncementScreen: React.FC<AddAnnouncementScreenProps> = ({
  navigation,
}) => {
  const route = useRoute<RouteProp<RouteParams>>();
  const styles = AddAnnouncementStyles();
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
  const [allRecipientsIds, setAllRecipientsIds] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<guestInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [atachmentArr, setAttachmentArr] = useState<attachmentArrInterface[]>(
    [],
  );
  const [ticketerrorMessage, setticketerrorMessage] = useState(false);
  const [recipienterrorMessage, setrecipienterrorMessage] = useState(false);
  const [addedByerrorMessage, setaddedByerrorMessage] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [ticketTypeArr, setTicketTypeArr] = useState<any[]>([]);
  const [collaboratorArr, setCollaboratorArr] = useState<any[]>([]);
  const [announcementText, setAnnouncementText] = React.useState('');
  const [totalCount, setTotalCount] = useState<any>(0);
  const { eventData, announcementId: ID } = route?.params || {};
  const [announcementId, setAnnouncementId] = React.useState(ID);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [collaborators, setCollaborators] = useState([]);
  const { uploadFileHook } = useUploadFile();
  const { apiRequest } = useApi();

  const { data: announcementDetailsData } = useFetchAnnouncementDetailQuery(
    { eventId: eventData?.id, announcementId: announcementId },
    { skip: !announcementId },
  );

  const recipientQuery = {
    eventId: eventData?.id,
    announcementId,
    searchText: '',
    take: 10,
    skip: 0,
  };

  const { data: selectedRecipientData } = useFetchSelectedRecipientsQuery(
    recipientQuery,
    { skip: !announcementId },
  );

  useEffect(() => {
    const owner = {
      ...eventData?.owner,
      name: eventData?.owner?.companyName,
      role: { id: eventData?.owner?.id, name: 'host' },
    };
    console.log('owner', owner);

    const approvedCollaborators = eventData?.collaborators?.filter(
      (col: any) => col.isApproved,
    );
    setCollaborators([owner, ...(approvedCollaborators || [])]);
  }, [eventData]);

  useEffect(() => {
    const backAction = () => {
      leaveAnnouncement();
      return true; // Prevents default behavior (app closing)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove(); // Cleanup on unmount
  }, []);

  const handleBackPress = () => {
    leaveAnnouncement();
  };

  useEffect(() => {
    if (announcementDetailsData != undefined) {
      setTicketTypeArr(announcementDetailsData?.data?.ticketType);
      setCollaboratorArr(announcementDetailsData?.data?.addedBy);
      setAnnouncementText(announcementDetailsData.data?.announcement);
      setAttachmentArr(announcementDetailsData?.data?.attachments);
    }
  }, [announcementDetailsData]);

  useEffect(() => {
    if (selectedRecipientData != undefined) {
      setallRecipients(selectedRecipientData?.data?.result);
    }
  }, [selectedRecipientData]);

  const getRecipients = async () => {
    console.log('ticketTypeArr', ticketTypeArr);
    setRefreshing(true);
    const ticketQueryString = ticketTypeArr
      .map((item: any) => `ticketType=${item.id}`)
      .join('&');
    const collaboratorQueryString = selectedCollaborator
      .map((item: any) => `&addedBy=${item.id}`)
      .join('&');
    const queryArgs = {
      eventId: eventData?.id,
      ticketType: ticketQueryString,
      addedBy: collaboratorQueryString,
      searchText: searchText,
      take: 10,
      skip: (currentPage - 1) * 10,
    } as const;

    const announcementRecipientsData: any = await apiRequest(
      'get',
      `events/v1/event/${queryArgs.eventId}/event-announcement-guest?${queryArgs.ticketType}${queryArgs.addedBy}&findByName=${searchText}&take=${queryArgs.take}&skip=${queryArgs.skip}`,
    );
    if (announcementRecipientsData.data) {
      getAllRecipientsId() // Just for hack now to get all recipents ids we need to fix it from backend
      setrecipienterrorMessage(false);
      setTotalCount(announcementRecipientsData?.data?.totalCount);
      setallRecipients(prev =>
        currentPage === 1
          ? announcementRecipientsData?.data?.result
          : [...prev, ...announcementRecipientsData?.data?.result],
      );
      setRefreshing(false);
    }
  };


  const getAllRecipientsId = async () => {
    const ticketQueryString = ticketTypeArr
      .map((item: any) => `ticketType=${item.id}`)
      .join('&');
    const collaboratorQueryString = selectedCollaborator
      .map((item: any) => `&addedBy=${item.id}`)
      .join('&');
    const queryArgs = {
      eventId: eventData?.id,
      ticketType: ticketQueryString,
      addedBy: collaboratorQueryString,
      searchText: searchText,
      take: 10000,
      skip: 0,
    } as const;

    const announcementRecipientsData: any = await apiRequest(
      'get',
      `events/v1/event/${queryArgs.eventId}/event-announcement-guest?${queryArgs.ticketType}${queryArgs.addedBy}&findByName=${searchText}&take=${queryArgs.take}&skip=${queryArgs.skip}`,
    );
    if (announcementRecipientsData.data) {
      const allRecipientsIds = announcementRecipientsData?.data?.result?.map((item: any) => item.id);
      setAllRecipientsIds(allRecipientsIds)
    };
  }

  const [createEventAnnouncement] = useCreateEventAnnouncementMutation();

  const [deleteEventAnnouncement] = useDeleteEventAnnouncementMutation();

  const [editEventAnnouncement] = useEditEventAnnouncementMutation();

  const checkAnnouncement = async () => {
    if (
      announcementRef.current.validateInputs() &&
      ticketTypeArr?.length != 0 &&
      collaboratorArr?.length != 0 &&
      allRecipients?.length != 0
    ) {
      postBottomSheetRef.current?.open();
      // postAnnouncement()
    } else {
      ticketTypeArr?.length == 0 && setticketerrorMessage(true);
      collaboratorArr?.length == 0 && setaddedByerrorMessage(true);
      allRecipients?.length == 0 && setrecipienterrorMessage(true);
      announcementRef.current.validateInputs();
    }
  };

  const postAnnouncement = async () => {
    try {
      setLoading(true)
      const addAnnouncementRequest: addAnnouncementRequestInterface = {
        ticketType: selectedTicketType.map((item: any) => item.id),
        addedBy: selectedCollaborator.map((item: any) => item.id),
        announcement: announcementRef.current.inputText,
        attachments: atachmentArr,
        recipients: allRecipientsIds,
      };
      const response = await createEventAnnouncement({
        eventId: eventData?.id || '',
        payload: addAnnouncementRequest,
      }).unwrap();

      setLoading(false)

      if (response.success == true) {
        FlashMessageComponent.show('success', ANNOUNCEMENT.Announcement_posted);
        dispatch(setRsvpStatus('UPDATE' + Date.now()));
        navigation.goBack();
      } else {
        const typedError = response as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      }
    } catch (error) {
      setLoading(false)
      const typedError = error as ApiErrorInterface;
      FlashMessageComponent.show('error', getErrorMessage(typedError));
    }
  };

  const renderBottomSheetContent = () => {
    switch (activeView) {
      case 'collaborator':
        return <Collaborator collaborators={collaborators} selectedCollaborator={selectedCollaborator} toggleCollaborator={toggleCollaborator} cancelClick={cancelClick} confirmCollaborator={confirmCollaborator} />;
      case 'ticketTypeOptions':
        return <TicketType eventData={eventData} selectedTicketType={selectedTicketType} toggleTicketType={toggleTicketType} cancelClick={cancelClick} confirmTicketType={confirmTicketType} />;
      case 'receipient':
        return <Recipient
          allRecipients={allRecipients}
          searchInputRef={searchInputRef}
          handleSearchTextChange={handleSearchTextChange}
          searchText={searchText}
          totalCount={totalCount}
          selectedUsers={selectedUsers}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      default:
        return null;
    }
  };
  const getSnapPoints = (): string => {
    switch (activeView) {
      case 'collaborator':
        return collaborators.length == 1
          ? `30%`
          : collaborators.length > 8
            ? '80%'
            : `${collaborators.length * 7 + 20}%`;
      case 'submit':
        return '70%';
      case 'ticketTypeOptions':
        return eventData?.ticketTypes.length == 1
          ? `30%`
          : eventData?.ticketTypes.length > 8
            ? '80%'
            : `${eventData?.ticketTypes.length * 7 + 20}%`;
      case 'receipient':
        return '80 %'; // : `${(allRecipients.length * 10 + 10)}%`
      default:
        return '85%';
    }
  };
  const cancelClick = () => bottomSheetRef.current?.close();
  const confirmTicketType = () => {
    if (selectedTicketType.length == 0) {
      setTicketTypeArr([]);
      setticketerrorMessage(true);
    } else {
      setticketerrorMessage(false);
      setTicketTypeArr(selectedTicketType);
    }
    bottomSheetRef.current?.close();
  };

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
  };
  const toggleTicketType = (item: any, index: number) => {
    if (selectedTicketType.includes(item)) {
      setSelectedTicketType(selectedTicketType.filter((i: any) => i !== item));
    } else {
      setSelectedTicketType([...selectedTicketType, item]);
    }
  };
  useEffect(() => {
    //   if (announcementId == null) {
    console.log('ticketTypeArr', ticketTypeArr);
    console.log('collaboratorArr', collaboratorArr);
    if (ticketTypeArr.length > 0 && collaboratorArr.length > 0) {
      getRecipients();
    } else {
      setallRecipients([]);
    }
    //  }
  }, [ticketTypeArr, collaboratorArr, searchText, currentPage]);

  const confirmCollaborator = () => {
    if (selectedCollaborator.length == 0) {
      setCollaboratorArr([]);
      setaddedByerrorMessage(true);
    } else {
      setaddedByerrorMessage(false);
      setCollaboratorArr(selectedCollaborator);
    }
    bottomSheetRef.current?.close();
  };
  const removeCollaborator = (item: any) => {
    if (collaboratorArr?.includes(item)) {
      setCollaboratorArr(selectedCollaborator?.filter((i: any) => i !== item));
    } else {
      setCollaboratorArr([...selectedCollaborator, item]);
    }
    if (selectedCollaborator.includes(item)) {
      setselectedCollaborator(
        selectedCollaborator.filter((i: any) => i !== item),
      );
    } else {
      setselectedCollaborator([...selectedCollaborator, item]);
    }
  };
  const toggleCollaborator = (item: any, index: number) => {
    if (selectedCollaborator.includes(item)) {
      setselectedCollaborator(
        selectedCollaborator.filter((i: any) => i !== item),
      );
    } else {
      setselectedCollaborator([...selectedCollaborator, item]);
    }
  };
  const handleSearchTextChange = (text: string) => {
    setCurrentPage(1);
    setSearchText(text);
  };
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
        FlashMessageComponent.show('success', ANNOUNCEMENT.Announcement_deleted);
        deleteBottomSheetRef.current?.close();
        dispatch(setRsvpStatus('UPDATE' + Date.now()));
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
      console.log('in try');
      const editAnnouncementRequest: editAnnouncementRequestInterface = {
        announcement: announcementRef.current.inputText,
        attachments: atachmentArr,
      };
      const response = await editEventAnnouncement({
        eventId: eventData?.id || '',
        announcementId: announcementId || '',
        payload: editAnnouncementRequest,
      }).unwrap();
      if (response.success == true) {
        FlashMessageComponent.show('success', ANNOUNCEMENT.Announcement_updated);
        dispatch(setRsvpStatus('UPDATE' + Date.now()));
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
      announcementRef.current.validateInputs() &&
      ticketTypeArr?.length != 0 &&
      collaboratorArr?.length != 0
    ) {
      leaveBottomSheetRef.current?.open();
    } else {
      navigation.goBack();
    }
  };
  const openCamera = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: false,
    })
      .then((image: ImageOrVideo) => {
        if (image.size && image.size <= MAX_IMAGE_SIZE_BYTES) {
          editPhotoBottomSheetRef.current?.close();
          savePhoto(image?.path, 'image', image?.filename, image?.size);  
        } else {
          Alert.alert(
            'Image Size Error',
            'Please select an image that is under 5MB in size.',
            [{ text: 'OK' }]
          );          
        }
      })
      .catch(async error => {
        console.log('ImagePicker Error: ', error);

        if (error?.message?.includes('did not grant library permission')) {
          Alert.alert(
            PERMISSION.PERMISSION_REQUIRED,
            PERMISSION.GALLERY_PERMISSION,
            [
              {
                text: BUTTON_LABLE.CANCEL,
                style: 'cancel',
              },
              {
                text: PERMISSION.OPEN_SETTING,
                onPress: async () => {
                  openSettings();
                },
              },
            ],
          );
        }
      });
  };
  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Only allows PDFs
      });
      if (res != null) {
        if (res[0]?.size > 5242880) {
          FlashMessageComponent.show('error', ERROR_MESSAGE.FILE_SIZE_EXCEED);
        } else {
          editPhotoBottomSheetRef.current?.close();
          savePhoto(res[0].uri, 'pdf', res[0].name, res[0].size);
        }
      } else {
        FlashMessageComponent.show('error', ERROR_MESSAGE.SOMETHING_WENT_WRONG);
      }
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
    setAnnouncementId(null);
    setTicketTypeArr([]);
    setCollaboratorArr([]);
    setAnnouncementText('');
    setAttachmentArr([]);
  };
  const getFilePathFromContentUri = async (
    contentUri: string,
    fileName: string,
  ) => {
    const filePath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
    await RNFS.copyFile(contentUri, filePath);
    return `file://${filePath}`;
  };
  const savePhoto = async (image: any, type: string, name: any, size: any) => {
    setRefreshing(true);
    try {
      const imagePath =
        Platform.OS === 'android' && type === 'pdf'
          ? await getFilePathFromContentUri(image, name)
          : image;
      const data = await fetch(imagePath);
      const blob = await data.blob();
      const fileName = name || image.split('/').pop();
      const pathType = 'announcement';
      const response = await uploadFileHook(
        fileName,
        size,
        type,
        blob,
        pathType,
      );
      if (response.success == true) {
        const imageUrl =
          environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
        let data = {
          mediaType: type,
          media: imageUrl,
          mediaName: name,
        };
        setRefreshing(false);
        setAttachmentArr((prev: any) => [...prev, data]);
      } else {
        console.log('savePhoto else', response);
      }
      // const response: any = await uploadFile(image, size, type, blob);
      console.log('savePhoto', response);
    } catch (error) {
      setRefreshing(false);
      console.error('Error uploading image:', error);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <Header
        headerTitle={
          announcementId != null
            ? ANNOUNCEMENT.Edit_Announcement
            : ANNOUNCEMENT.New_Announcement
        }
        onPress={handleBackPress}
        showProgressBar={false}
        rightIcon={announcementId != null ? IMAGES.plus : null}
        onPressRightIcon={removeAnnouncementId}
        rightIconWrapperStyle={{ backgroundColor: COLORS.black }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>

          <RecipientDetail
            allRecipients={allRecipients}
            recipientCount={totalCount}
            ticketerrorMessage={ticketerrorMessage}
            announcementId={announcementId}
            ticketTypeRef={ticketTypeRef}
            ticketTypeArr={ticketTypeArr}
            removeTicketType={removeTicketType}
            setActiveTab={setActiveTab}
            setSelectedTicketType={setSelectedTicketType}
            bottomSheetRef={bottomSheetRef}
            addedByerrorMessage={addedByerrorMessage}
            addedRef={addedRef}
            collaboratorArr={collaboratorArr}
            removeCollaborator={removeCollaborator}
            setselectedCollaborator={setselectedCollaborator}
            recipienterrorMessage={recipienterrorMessage} />

          <AnnouncementDetail
            announcementText={announcementText}
            setAnnouncementText={setAnnouncementText}
            refreshing={refreshing}
            announcementRef={announcementRef}
            atachmentArr={atachmentArr}
            editPhotoClick={editPhotoClick}
            onPressDelete={onPressDelete} />

        </View>
      </ScrollView>
      {announcementId != null ? (
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
            style={[
              styles.btnStyle,
              {
                marginTop: verticalMarginScale(10),
              },
            ]}
            title={ANNOUNCEMENT.Update_Announcement}
            colorTheme="dark"
            onPress={() => editBottomSheetRef.current?.open()}
          />
        </>
      ) : (
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={ANNOUNCEMENT.Post_Announcement}
          colorTheme="dark"
          loading={isLoading}
          onPress={checkAnnouncement}
        />
      )}

      <BottomSheetComponent
        ref={bottomSheetRef}
        onClose={() => {
          bottomSheetRef?.current?.close();
        }}
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
        back={deleteAnnouncement}
      />

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
        isLoading={isLoading}
        title={ANNOUNCEMENT.Post_Announcement}
        subTitle={
          ANNOUNCEMENT.announcement_des + totalCount + ' recipients'
        }

        btnLabel={ANNOUNCEMENT.Post_Announcement}
        back={() => postAnnouncement()}
      />
    </KeyboardAvoidingView>
  );
};

export default AddAnnouncementScreen;
