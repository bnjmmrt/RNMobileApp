import React, { useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {setPageProgress} from '../../../redux/slices/appFlowSlice';
import Header from '../../../component/Header/Header';
import {
  BUTTON_LABLE,
  COLORS,
  ERROR_MESSAGE,
  PROFILE,
} from '../../../utils/constants';
import {useNavigation} from '@react-navigation/native';
import {Hp, Wp} from '../../../utils/dimensions';
import {fontFamily} from '../../../utils/functions';
import CreativeFocusComponent from './CreativeFocusComponent';
import Button from '../../../component/Button';
import ConfirmationBottomSheet from '../../../component/BottomSheet/ConfirmationBottomSheet';
import IMAGES from '@images/index';
import Toast from '../../../component/Toast/Toast';
import useApi from '../../../axios/useApi';
import {EndPoint} from 'src/ApiManager/config';

interface FeedbackScreenProps {}

interface ConfigData {
  logo: string;
  title: string;
  subTitle: string;
  connectBtnBackground: string;
  snapPoints?: any;
}

export interface Tag {
  id: number;
  name: string;
  value: string;
}

const list: Tag[] = [
  {id: 1, name: 'General', value: 'general'},
  {id: 2, name: 'Bug', value: 'bug'},
  {id: 3, name: 'New Feature Suggestions', value: 'new_feature_suggestion'},
  {id: 4, name: 'New Event Suggestions', value: 'new_event_suggestion'},
];
const FeedbackScreen: React.FC<FeedbackScreenProps> = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {apiRequest, loading, error} = useApi();
  const [feedback, setFeedback] = useState('');
  const confirmationRef = useRef<any>(null);
  const [isToastShown, setIsToastShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedData, getSelectedData] = useState<Tag[]>();


  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.goBack();
  };

  const onSubmit = async () => {
    if (!feedback) {
      setErrorMessage(ERROR_MESSAGE.FEEDBACK_ERROR);
    } else if (!isToastShown && selectedData) {
      setErrorMessage('');

      confirmationRef.current.open();
      return

      const requestData = {
        description: feedback,
        tag: selectedData[0].value,
        userId: 'userId',
      };
      console.log('requestObject', requestData);
      const response: any = await apiRequest(
        'post',
        EndPoint.host_feedback,
        requestData,
      );
      if (response.data) {
        // show confirmation sheet on API success
        confirmationRef.current.open();
      } else {
        //error message

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

        <View
          style={[
            styles.textareaContainer,
            errorMessage ? styles.errorInputWrapper : null,
          ]}>
          <TextInput
            style={styles.textArea}
            placeholder="Enter Feedback"
            placeholderTextColor="#c4c4c4"
            multiline
            numberOfLines={6}
            value={feedback}
            onChangeText={text => setFeedback(text)}
          />
        </View>
        {errorMessage ? (
          <Text style={[styles.errorText]}>{errorMessage}</Text>
        ) : null}
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
      />

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.CONFIRM}
        colorTheme="dark"
        onPress={onSubmit}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: '100%',
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: 13,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
    textAlign: 'center',
    marginBottom: 16,
  },

  textareaContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    width: '100%',
  },
  textArea: {
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    height: 100,
  },
  tagText: {
    fontFamily: fontFamily.RomieTrial_Bold,
    fontSize: 20,
    marginTop: 20,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
    marginBottom: 100,
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
});
export default FeedbackScreen;
