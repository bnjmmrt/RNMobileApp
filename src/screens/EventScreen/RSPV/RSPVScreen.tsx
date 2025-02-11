import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import Title from 'src/component/Title/Title';
import Input from 'src/component/Input/Input';
import { BUTTON_LABLE, COLORS } from 'src/utils/constants';
import RequestVouch from './RequestVouch';
import useContactPermission from 'src/utils/hooks/useContactPermission';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './RSPVScreenStyle';
import {
  useDeleteApplicationMutation,
  useGetQuizQuestionQuery,
  useSubmitApplicationMutation,
  useUpdateApplicationMutation,
} from 'src/redux/actions/rspvApiAction';
import { verticalScale } from 'src/utils/dimensions';

type Guest = {
  id: number;
  label: string;
};

const optionList = [
  { id: 0, label: 'Request a Vouch' },
  { id: 1, label: 'Cancel Application' },
];

const RSPVScreen: React.FC = () => {
  const bottomSheetRef = useRef<any>(null);
  const { params } = useRoute();

  const inputRefs = useRef<{ [key: number]: any }>({});
  const { goBack } = useNavigation();
  const { name, location, startDate, status, quizQuestions, guestsCount, id } =
    params?.event;

  const [selectedGuests, setSelectedGuests] = useState<any>(null);
  const [activeView, setActiveTab] = useState<string>('');
  const { requestContactPermission } = useContactPermission();
  const guestInputRef = useRef(null);
  const [submitApplication, { isLoading: isSubmitting }] =
    useSubmitApplicationMutation();
  const [updateApplication, { isLoading: isUpdating }] =
    useUpdateApplicationMutation();
  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteApplicationMutation();

  const handleSubmitApplication = async () => {
    if (!validateInputs()) return;

    try {
      const response = await submitApplication({
        eventId: id,
        answers: quizQuestions.map(q => ({
          questionId: q.id,
          answer: inputRefs.current[q.id]?.inputText || '',
        })),
        guests: selectedGuests ? selectedGuests.id : 0,
      }).unwrap();
      console.log('Application submitted:', response);
      setActiveTab('submit');
      bottomSheetRef.current?.open();
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const handleUpdateApplication = async () => {
    try {
      const response = await updateApplication({
        eventId: id,
        answers: quizQuestions.map(q => ({
          questionId: q.id,
          answer: inputRefs.current[q.id]?.inputText || '',
        })),
        guests: selectedGuests ? selectedGuests.id : 0,
      }).unwrap();

      console.log('Application updated:', response);
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleCancelApplication = async () => {
    try {
      const response = await deleteApplication({ eventId: id }).unwrap();
      console.log('Application canceled:', response);
      bottomSheetRef?.current?.close();
    } catch (error) {
      console.error('Error canceling application:', error);
    }
  };

  const validateInputs = (): boolean => {
    let isValid = true;

    quizQuestions.forEach(q => {
      if (q.required) {
        const inputValue = inputRefs.current[q.id]?.inputText;
        if (!inputValue) {
          inputRefs.current[q.id]?.setErrorMessage(
            'Please complete required field',
          );
          isValid = false;
        }
      }
    });
    if (guestsCount > 0 && !selectedGuests) {
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
            await requestContactPermission();
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
      />
    </View>
  );

  const renderBottomSheetContent = () => {
    switch (activeView) {
      case 'submit':
        return renderApplicationSubmitted();
      case 'guests':
        return renderNumberOfGuests(guestsCount);
      case 'vouch':
        return <RequestVouch />;
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
        return '30%';
      case 'submit':
        return '60%';
      case 'options':
        return '20%';
      case 'cancel':
        return '33%';
      case 'leave':
        return '40%';
      default:
        return '85%';
    }
  };
  const generateGuestList = (guestsCount: number): Guest[] => {
    const guestList: Guest[] = [{ id: 0, label: 'No Guests' }];

    for (let i = 1; i <= guestsCount; i++) {
      guestList.push({ id: i, label: `${i} Guest${i > 1 ? 's' : ''}` });
    }

    return guestList;
  };

  const renderNumberOfGuests = (guestsCount: number) => {
    const guestList = generateGuestList(guestsCount);

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
        <Text style={[styles.optionText, { color: COLORS.white }]}>
          Cancel Application
        </Text>
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
        style={styles.btnStyle}
        title={'Leave'}
        colorTheme="dark"
        onPress={() => {
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
        headerTitle="RSPV"
        showProgressBar={false}
        onPress={() => {
          setActiveTab('leave');
          bottomSheetRef?.current?.open();
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <View style={styles.eventContainer}>
            <FastImage
              source={IMAGES.eventCoverPlaceholders}
              style={styles.eventImage}
            />
            <View>
              <CustomText style={styles.eventTitle}>{name}</CustomText>
              <CustomText style={styles.eventDetails}>
                Fri, April 13 , 9:00PM - 11:00PM EST
              </CustomText>
              <CustomText style={styles.eventDetails}>
                {location?.location} , {location?.city}
              </CustomText>
            </View>
          </View>
          {status != 0 && (
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
                <Image source={IMAGES.downArrow} style={styles.downArrowIcon} resizeMode='contain' />
              </TouchableOpacity>
            </View>
          )}
          {quizQuestions.map(q => (
            <Input
              key={q.id}
              inputFieldContainerStyle={{ height: verticalScale(48) }}
              isRequired={q.required}
              ref={ref => (inputRefs.current[q.id] = ref)}
              label={q.question}
            />
          ))}
          {guestsCount > 0 && (
            <Input
              inputFieldContainerStyle={{ height: verticalScale(48) }}
              editable={false}
              isRequired={true}
              ref={guestInputRef}
              rightImage={IMAGES.downArrow}
              placeholder={selectedGuests?.label}
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
          snapPoints={[getSnapPoints()]}>
          <View style={styles.bottomSheetContent}>
            {renderBottomSheetContent()}
          </View>
        </BottomSheetComponent>
      </ScrollView>
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={
          status != 0
            ? BUTTON_LABLE.UPDATE_APPLICATION
            : BUTTON_LABLE.SUBMTI_APPLICATION
        }
        colorTheme="dark"
        loading={isSubmitting || isUpdating}
        onPress={
          status != 0 ? handleSubmitApplication : handleUpdateApplication
        }
      />
    </SafeAreaView>
  );
};

export default RSPVScreen;
