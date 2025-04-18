import IMAGES from '@images/index';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { changeSafeAreaViewConfig, fontFamily } from '../../../utils/functions';
import CreativeFocusComponent from './CreativeFocusComponent';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { CustomText } from 'src/component/CustomText';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { isIPad } from 'src/utils/isTabletConfig';

interface FeedbackScreenProps { }

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
  const role = useSelector((state: RootState) => state.auth.role);

  const feedbackRef = useRef<InputRefMethods>(null);

  useEffect(() => {
    // Keyboard.dismiss()
  }, [selectedData]);
  const handleBackPress = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

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
        role: role
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
    <View style={styles.container}>
      <Header
        headerTitle={PROFILE.FEEDBACK}
        onPress={handleBackPress}
        showProgressBar={false}
        showBackButton={!isIPad}
      />
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.contentContainer}>
            <CustomText style={styles.subTitle}>
              {PROFILE.FEEDBACK_SUBTITLE}
            </CustomText>
            <Input
              ref={feedbackRef}
              placeholder={LABLE.ENTER_FEEDBACK}
              errorMessage={ERROR_MESSAGE.FEEDBACK_ERROR}
              keyboardType="ascii-capable"
              multiline={true}
              maxLength={250}
              hasHandler={true}
            />
            <CustomText style={styles.tagText}>Tag</CustomText>
            <CreativeFocusComponent
              list={list}
              setIsToastShown={setIsToastShown}
              getSelectedData={getSelectedData}
            />
            {isToastShown && (
              <CustomText style={styles.error}>Please select tag</CustomText>
            )}
          </View>

          <ConfirmationBottomSheet
            ref={confirmationRef}
            logo={IMAGES.check_gray}
            title={PROFILE.FEEDBACK_MESSAGE}
            subTitle={PROFILE.FEEDBACK_CONFIRMATION_MESSAGE}
            btnLabel={BUTTON_LABLE.CLOSE}
            logoStyle={{
              width: 96,
              height: 96,
            }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    height: '100%',
    paddingBottom: 100,
  },
  subTitle: {
    color: COLORS.light_gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagText: {
    fontFamily: fontFamily.RomieTrial_Bold,
    fontSize: 20,
    marginTop: 24,
  },
  btnStyle: {
    width: '85%',
    borderRadius: 100,
    bottom: BOTTOM_SAFEAREA_SPACING,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
  error: {
    color: COLORS.errorText,
    fontSize: 12,
    fontWeight: '500',
  },
});
export default FeedbackScreen;
