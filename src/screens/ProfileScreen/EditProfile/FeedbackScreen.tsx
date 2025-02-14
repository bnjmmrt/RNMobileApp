import React, {useRef, useState} from 'react';
import {Platform, StyleSheet, Text,View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useSelector} from 'react-redux';
import Header from '../../../component/Header/Header';
import {
  BUTTON_LABLE,
  COLORS,
  ERROR_MESSAGE,
  LABLE,
  PROFILE,
} from '../../../utils/constants';
import {useNavigation} from '@react-navigation/native';
import {
  fontScale,
  horizontalMarginScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../../../utils/dimensions';
import {fontFamily} from '../../../utils/functions';
import CreativeFocusComponent from './CreativeFocusComponent';
import Button from '../../../component/Button';
import ConfirmationBottomSheet from '../../../component/BottomSheet/ConfirmationBottomSheet';
import IMAGES from '@images/index';
import Toast from '../../../component/Toast/Toast';
import useApi from '../../../axios/useApi';
import {EndPoint} from 'src/ApiManager/config';
import {RootState} from '../../../redux/slices';
import Input from 'src/component/Input/Input';

interface FeedbackScreenProps {}

export interface Tag {
  id: number;
  name: string;
  value: string;
}

const list: Tag[] = [
  {id: 1, name: 'General', value: 'general'},
  {id: 2, name: 'Bug', value: 'bug'},
  {id: 3, name: 'New Feature Suggestions', value: 'new_feature_suggestion'},
  // {id: 4, name: 'New Event Suggestions', value: 'new_event_suggestion'},
];
const FeedbackScreen: React.FC<FeedbackScreenProps> = () => {
  const navigation = useNavigation();
  const {apiRequest, loading, error} = useApi();
  const confirmationRef = useRef<any>(null);
  const [isToastShown, setIsToastShown] = useState(false);

  const [selectedData, getSelectedData] = useState<Tag[]>();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const feedbackRef = useRef<any>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const onSubmit = async () => {
    if (
      feedbackRef?.current.validateInputs() &&
      !isToastShown &&
      selectedData
    ) {
      const requestData = {
        description: feedbackRef?.current.inputText,
        tag: selectedData[0].value,
        userId: loginData?.id,
      };
      console.log('requestObject', requestData);
      const response: any = await apiRequest(
        'post',
        EndPoint.host_feedback,
        requestData,
      );
      console.log('feedback response', response);
      if (response.status === 200) {
        confirmationRef.current.open();
        //  clearData()
      }
    } else {
      setIsToastShown(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={PROFILE.FEEDBACK}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.subTitle}>{PROFILE.FEEDBACK_SUBTITLE}</Text>
        <Input
          ref={feedbackRef}
          placeholder={LABLE.ENTER_FEEDBACK}
          errorMessage={ERROR_MESSAGE.FEEDBACK_ERROR}
          multiline={true}
        />
        <Text style={styles.tagText}>Tag</Text>
        <CreativeFocusComponent
          list={list}
          setIsToastShown={setIsToastShown}
          getSelectedData={getSelectedData}
        />

        {isToastShown && (
          <Toast
            message={'Please select at least one'}
            onClose={() => setIsToastShown(false)}
          />
        )}
      </View>

      <ConfirmationBottomSheet
        ref={confirmationRef}
        logo={IMAGES.check}
        title={PROFILE.FEEDBACK_MESSAGE}
        subTitle={PROFILE.FEEDBACK_CONFIRMATION_MESSAGE}
        btnLabel={BUTTON_LABLE.CLOSE}
        back={handleBackPress}
      />

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.CONFIRM}
        colorTheme="dark"
        onPress={onSubmit}
        loading={loading}
      />
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
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(13),
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
    textAlign: 'center',
    marginBottom: verticalMarginScale(16),
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
});
export default FeedbackScreen;
