import IMAGES from '@images/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useApi from 'src/axios/useApi';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import Input from 'src/component/Input/Input';
import Title from 'src/component/Title/Title';
import {
  useDeleteApplicationMutation,
  useSubmitApplicationMutation,
  useUpdateApplicationMutation,
} from 'src/redux/actions/rspvApiAction';
import { RootState } from 'src/redux/slices';
import { setRsvpStatus } from 'src/redux/slices/rspvSlice';
import { BUTTON_LABLE, COLORS } from 'src/utils/constants';
import { verticalScale } from 'src/utils/dimensions';
import { fontFamily, removeSignature } from 'src/utils/functions';
import { EventCard } from '../RSVP/RSVPInvitedUpcoming';
import { styles } from './RSVPScreenStyle';
import RequestVouch from './RequestVouch';
import { formatDetailedEventDate } from 'src/utils/dateFunctions';
import useKeyboard from 'src/utils/hooks/useKeyboard';

type Guest = {
  id: number;
  label: string;
};

const optionList = [
  { id: 0, label: 'Request a Vouch' },
  { id: 1, label: 'Cancel Application' },
];

const RSVPNoStatusApplied: React.FC = () => {
  const bottomSheetRef = useRef<any>(null);
  const { keyboardVisible } = useKeyboard();
  const { params } = useRoute();
  const inputRefs = useRef<{ [key: number]: any }>({});
  const { goBack, navigate } = useNavigation();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { apiRequest, loading } = useApi();
  const dispatch = useDispatch();

  const {
    name,
    location,
    startDate,
    status,
    quizQuestions,
    limitOnePlus,
    id,
    currentGuestStatus,
    imageFlyer,
    endDate,
    timeZone
  } = params?.event;

  const [eventQuestions, setEventQuestions] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState<any>(null);
  const [vouchData, setVouchData] = useState<any>([]);
  const [activeView, setActiveTab] = useState<string>('');
  const guestInputRef = useRef(null);
  const [submitApplication, { isLoading: isSubmitting }] =
    useSubmitApplicationMutation();
  const [updateApplication, { isLoading: isUpdating }] =
    useUpdateApplicationMutation();
  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteApplicationMutation();

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    if (
      quizQuestions.length == 0 &&
      limitOnePlus == 0 &&
      currentGuestStatus !== 'APPLIED'
    ) {
      onSumbitCall();
    }
  }, []);

  const formattdQuestions = quizQuestions => {
    return quizQuestions.map(item => ({
      order: item.order,
      question: item.question,
      questionId: item.id,
      required: item.required,
    }));
  };
  const getQuestions = async () => {
    if (currentGuestStatus === 'APPLIED') {
      const response: any = await apiRequest(
        'get',
        `events/v1/users/${userId}/events/${id}/request`,
      );
      setEventQuestions(response?.data?.questions);
      setSelectedGuests(
        getGuestFromId(response?.data?.additionalRequestedGuests),
      );
      setVouchData(response?.data?.vouches);
    } else {
      setEventQuestions(formattdQuestions(quizQuestions));
    }
  };

  const onSumbitCall = async () => {
    try {
      const response = await submitApplication({
        id: userId,
        eventId: id,
        answers: eventQuestions.map(q => ({
          questionId: q.id,
          answer: inputRefs.current[q.id]?.inputText || '',
        })),
        additionalGuests: selectedGuests ? selectedGuests.id : 0,
      }).unwrap();
      console.log('Application submitted:', response);
      setActiveTab('submit');
      dispatch(setRsvpStatus('APPLIED'));
      bottomSheetRef.current?.open();
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const handleSubmitApplication = async () => {
    if (!validateInputs()) return;
    try {
      const requestParams = {
        id: userId,
        eventId: id,
        answers: eventQuestions.map(q => ({
          questionId: q.questionId,
          answer: inputRefs.current[q.questionId]?.inputText || '',
        })),
        additionalGuests: selectedGuests ? selectedGuests.id : 0,

      }
      const response = await submitApplication(requestParams).unwrap();
      console.log('Application submitted:', response);
      setActiveTab('submit');
      dispatch(setRsvpStatus('APPLIED'));
      bottomSheetRef.current?.open();
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const handleUpdateApplication = async () => {
    if (!validateInputs()) return;
    try {
      const response = await updateApplication({
        id: userId,
        eventId: id,
        answers: eventQuestions.map(q => ({
          questionId: q.questionId,
          answer: inputRefs.current[q.questionId]?.inputText || '',
        })),
        additionalGuests: selectedGuests ? selectedGuests.id : 0,
      }).unwrap();
      console.log('Application updated:', response);
      setActiveTab('submit');
      dispatch(setRsvpStatus('APPLIED'));
      bottomSheetRef.current?.open();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleCancelApplication = async () => {
    try {
      const response = await deleteApplication({
        eventId: id,
        id: userId,
      }).unwrap();
      console.log('Application canceled:', response);
      bottomSheetRef?.current?.close();
      dispatch(setRsvpStatus('NO_STATUS'));
      goBack();
    } catch (error) {
      console.error('Error canceling application:', error);
    }
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    eventQuestions.forEach(q => {
      if (q.required) {
        const inputValue = inputRefs.current[q.questionId]?.inputText;
        if (!inputValue) {
          inputRefs.current[q.questionId]?.setErrorMessage(
            'Please complete required field',
          );
          isValid = false;
        }
      }
    });
    if (limitOnePlus > 0 && !selectedGuests) {
      guestInputRef.current?.setErrorMessage(
        'Please select the number of guests',
      );
      isValid = false;
    }
    return isValid;
  };

  const renderApplicationSubmitted = () => (
    <View>
      <CustomText style={styles.successText}>
        Your application has been submitted!
      </CustomText>
      <View style={[styles.yellowBox, { alignSelf: 'center' }]}>
        <Image source={IMAGES.loader} style={styles.loaderIcon} />
        <CustomText style={styles.waitingText}>
          Awaiting response from host
        </CustomText>
      </View>
      <CustomText style={styles.notificationText}>
        We’ll notify you when the host makes a decision.
      </CustomText>
      <View style={styles.boxView}>
        <CustomText style={styles.boostText}>
          Want to boost your chances of approval? Ask a member to vouch for you.
        </CustomText>
        <Button
          disabled={false}
          style={styles.requestBtn}
          title={'Request a Vouch'}
          colorTheme="dark"
          onPress={async () => {
            setActiveTab('vouch');
          }}
        />
      </View>
      <Button
        disabled={false}
        buttonType="stripe"
        style={styles.btnStyle}
        title={'Discover More Events'}
        colorTheme="dark"
        onPress={() => {
          bottomSheetRef?.current?.close();
          navigate('BottomTabBar');
        }}
      />
    </View>
  );

  const renderBottomSheetContent = () => {
    switch (activeView) {
      case 'submit':
        return renderApplicationSubmitted();
      case 'guests':
        return renderNumberOfGuests(limitOnePlus);
      case 'vouch':
        return <RequestVouch eventId={id} vouchData={vouchData} />;
      case 'options':
        return renderOptions();
      case 'cancel':
        return renderCancelPopup();
      case 'leave':
        return renderLeaveWithoutSubmitting();
      default:
        return null;
    }
  };

  const getSnapPoints = (): string => {
    switch (activeView) {
      case 'guests':
        return limitOnePlus == 0 ? '10%' : `${limitOnePlus * 6 + 10} %`;
      case 'submit':
        return Platform.OS == 'android' ? '70%' : '65%';
      case 'options':
        return '20%';
      case 'cancel':
        return '33%';
      case 'leave':
        return '42%';
      default:
        return '85%';
    }
  };
  const generateGuestList = (limitOnePlus: number): Guest[] => {
    const guestList: Guest[] = [{ id: 0, label: 'No Guests' }];

    for (let i = 1; i <= limitOnePlus; i++) {
      guestList.push({ id: i, label: `${i} Guest${i > 1 ? 's' : ''}` });
    }

    return guestList;
  };
  const getGuestFromId = (id: number): Guest => {
    if (id === 0) return { id: 0, label: 'No Guests' };
    return { id, label: `${id} Guest${id > 1 ? 's' : ''}` };
  };

  const renderNumberOfGuests = (limitOnePlus: number) => {
    const guestList = generateGuestList(limitOnePlus);

    if (guestList.length === 0) return null; // Don't render if no guests

    return (
      <FlatList
        data={guestList}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => {
              setSelectedGuests(item);
              bottomSheetRef?.current?.close();
            }}>
            <Text style={styles.guestButtonText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  const renderCancelPopup = () => (
    <View style={styles.cancelPopupContainer}>
      <CustomText style={styles.eventTitle}>
        Are you sure you want to cancel your application?
      </CustomText>
      <CustomText style={styles.descText}>
        This action cannot be undone. If your plans change, you can find the
        event in the Discover tab and request an invite.
      </CustomText>
      <TouchableOpacity
        onPress={handleCancelApplication}
        style={styles.redButton}>
        {isDeleting ? (
          <ActivityIndicator color={COLORS.black} />
        ) : (
          <Text style={[styles.optionText, { color: COLORS.white }]}>
            Cancel Application
          </Text>
        )}
      </TouchableOpacity>
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

  const renderLeaveWithoutSubmitting = () => (
    <View style={styles.leaveContainer}>
      <Title
        align="center"
        title="Leave without submitting?"
        subTitle="Are you sure you want to go back? Your changes will not be saved."
      />
      <Button
        disabled={false}
        style={[styles.btnStyle, { marginTop: verticalScale(16) }]}
        title={'Leave'}
        colorTheme="dark"
        onPress={() => {
          bottomSheetRef?.current?.close();
          goBack();
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle="RSVP"
        showProgressBar={false}
        onPress={() => {
          if (currentGuestStatus === 'APPLIED') {
            setActiveTab('leave');
            bottomSheetRef?.current?.open();
          } else {
            goBack();
          }
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <EventCard
            name={name}
            location={location?.location}
            imageCover={removeSignature(imageFlyer)}
            dates={formatDetailedEventDate(startDate, endDate, timeZone)}
          />
          {currentGuestStatus === 'APPLIED' && (
            <View style={styles.yellowBoxRightButton}>
              <View style={styles.waitingResponseContainer}>
                <Image source={IMAGES.loader} style={styles.loaderIcon} />
                <CustomText style={styles.waitingText}>
                  Awaiting response from host
                </CustomText>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setActiveTab('options');
                  bottomSheetRef?.current?.open();
                }}>
                <Image
                  source={IMAGES.downArrow}
                  style={styles.downArrowIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
          {eventQuestions &&
            eventQuestions.map(q => (
              <Input
                key={q.questionId}
                labelStyle={{
                  fontFamily: fontFamily.ABCDiatype_Medium,
                }}
                defaultValue={q?.answer}
                inputFieldContainerStyle={{ height: verticalScale(48) }}
                isRequired={q.required}
                ref={ref => (inputRefs.current[q.questionId] = ref)}
                label={q.question}
              />
            ))}
          {limitOnePlus > 0 && (
            <Input
              inputFieldContainerStyle={{ height: verticalScale(48) }}
              editable={false}
              labelStyle={{
                fontFamily: fontFamily.ABCDiatype_Medium,
              }}
              hasDropdown={true}
              isRequired={true}
              ref={guestInputRef}
              rightImage={IMAGES.downArrow}
              defaultValue={selectedGuests?.label}
              label="Request access for additional guests?"
              onPressImage={() => {
                setActiveTab('guests');
                bottomSheetRef?.current?.open();
                guestInputRef.current?.setErrorMessage('');
              }}
            />
          )}
        </View>

        <BottomSheetComponent
          ref={bottomSheetRef}
          onClose={() => {
            activeView !== 'cancel' &&
              activeView !== 'guests' &&
              activeView !== 'leave' &&
              activeView !== 'options' &&
              goBack();
          }}
          snapPoints={[getSnapPoints(), '95%']}>
          <View style={styles.bottomSheetContent}>
            {renderBottomSheetContent()}
          </View>
        </BottomSheetComponent>
      </ScrollView>
      {!keyboardVisible ? (
        <Button
          disabled={false}
          style={[styles.btnStyle, { marginBottom: verticalScale(20) }]}
          title={
            currentGuestStatus == 'APPLIED'
              ? BUTTON_LABLE.UPDATE_APPLICATION
              : BUTTON_LABLE.SUBMTI_APPLICATION
          }
          colorTheme="dark"
          loading={isSubmitting || isUpdating}
          onPress={
            currentGuestStatus !== 'APPLIED'
              ? handleSubmitApplication
              : handleUpdateApplication
          }
        />
      ) : null}
    </SafeAreaView>
  );
};

export default RSVPNoStatusApplied;
