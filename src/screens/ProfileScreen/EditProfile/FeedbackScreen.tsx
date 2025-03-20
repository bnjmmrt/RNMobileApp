import IMAGES from '@images/index';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Input, { InputRefMethods } from 'src/component/Input/Input';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import useApi from '../../../axios/useApi';
import ConfirmationBottomSheet from '../../../component/BottomSheet/ConfirmationBottomSheet';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import { RootState } from '../../../redux/slices';
import {
  BUTTON_LABLE,
  COLORS,
  ERROR_MESSAGE,
  LABLE,
  PROFILE,
} from '../../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../../../utils/dimensions';
import { fontFamily } from '../../../utils/functions';
import CreativeFocusComponent from './CreativeFocusComponent';

interface FeedbackScreenProps {}

export interface Tag {
  id: number;
  name: string;
  value: string;
}

const list: Tag[] = [
  { id: 1, name: 'General', value: 'general' },
  { id: 2, name: 'Bug', value: 'bug' },
  { id: 3, name: 'New Feature Suggestions', value: 'new_feature_suggestion' },
  { id: 4, name: 'New Event Suggestions', value: 'new_feature_suggestion' },
];
const FeedbackScreen: React.FC<FeedbackScreenProps> = () => {
  const navigation = useNavigation();
  const { keyboardVisible } = useKeyboard();
  const { apiRequest, loading, error } = useApi();
  const confirmationRef = useRef<any>(null);
  const [isToastShown, setIsToastShown] = useState(false);

  const [selectedData, getSelectedData] = useState<Tag[]>();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const feedbackRef = useRef<InputRefMethods>(null);

  useEffect(() => {
    // Keyboard.dismiss()
  }, [selectedData]);
  const handleBackPress = () => {
    navigation.goBack();
  };

  const validateLength = () => {
    const regex = /^\s*(\S+\s*){0,500}$/;
    if (!regex.test(feedbackRef?.current?.inputText || '')) {
      feedbackRef?.current?.setErrorMessage(ERROR_MESSAGE.FEEDBACK_SIZE_EXCEED);
      return false;
    }
    feedbackRef?.current?.setErrorMessage('');
    return true;
  };

  const onSubmit = async () => {
    if (selectedData?.length) {
      setIsToastShown(false);
    } else {
      setIsToastShown(true);
    }
    if (
      feedbackRef?.current?.validateInputs() &&
      validateLength() &&
      !isToastShown &&
      selectedData?.length
    ) {
      const requestData = {
        description: feedbackRef?.current?.inputText,
        tag: selectedData[0].value,
        userId: userId,
      };
      const response: any = await apiRequest(
        'post',
        EndPoint.host_feedback,
        requestData,
      );
      if (response.success) {
        confirmationRef.current.open();
        //  clearData()
      } else {
        FlashMessageComponent.show('error', response.message);
      }
    } else {
      // setIsToastShown(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={PROFILE.FEEDBACK}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.contentContainer}>
            <Text style={styles.subTitle}>{PROFILE.FEEDBACK_SUBTITLE}</Text>
            <Input
              ref={feedbackRef}
              placeholder={LABLE.ENTER_FEEDBACK}
              errorMessage={ERROR_MESSAGE.FEEDBACK_ERROR}
              keyboardType="ascii-capable"
              multiline={true}
              // maxLength={500}
            />
            <Text style={styles.tagText}>Tag</Text>
            <CreativeFocusComponent
              list={list}
              setIsToastShown={setIsToastShown}
              getSelectedData={getSelectedData}
            />
            {isToastShown && (
              <Text style={styles.error}>Please select tag</Text>
            )}
          </View>

          <ConfirmationBottomSheet
            ref={confirmationRef}
            logo={IMAGES.check_gray}
            title={PROFILE.FEEDBACK_MESSAGE}
            subTitle={PROFILE.FEEDBACK_CONFIRMATION_MESSAGE}
            btnLabel={BUTTON_LABLE.CLOSE}
            back={handleBackPress}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      {!keyboardVisible ? (
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.SUBMIT}
          colorTheme="dark"
          onPress={onSubmit}
          loading={loading}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: verticalMarginScale(0),
    paddingHorizontal: horizontalMarginScale(20),
    height: '100%',
    paddingBottom: 100,
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
    marginBottom: 12,
  },

  textareaContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(10),
    padding: verticalMarginScale(10),
    backgroundColor: COLORS.white,
    marginVertical: verticalMarginScale(10),
    width: '100%',
  },
  textArea: {
    textAlignVertical: 'top',
    fontSize: fontScale(16),
    color: '#333',
    height: verticalScale(100),
  },
  tagText: {
    fontFamily: fontFamily.RomieTrial_Bold,
    fontSize: fontScale(20),
    marginTop: verticalMarginScale(20),
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: radiusScale(100),
    bottom: Platform.OS === 'android' ? verticalMarginScale(20) : 0,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  errorText: {
    fontSize: fontScale(12),
    marginTop: verticalMarginScale(5),
    color: COLORS.errorText,
  },
  error: {
    color: COLORS.errorText,
    fontSize: fontScale(12),
    fontWeight: '500',
  },
});
export default FeedbackScreen;
