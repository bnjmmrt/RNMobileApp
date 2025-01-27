import React, {useRef, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setPageProgress} from '../../../redux/slices/appFlowSlice';
import Header from '../../../component/Header/Header';

import {COLORS, PROFILE} from '../../../utils/constants';

import {useNavigation} from '@react-navigation/native';
import {Hp, Wp} from '../../../utils/dimensions';
import {fontFamily} from '../../../utils/functions';

import CreativeFocusComponent from './CreativeFocusComponent';
interface FeedbackScreenProps {}

interface ConfigData {
  logo: string;
  title: string;
  subTitle: string;
  connectBtnBackground: string;
  snapPoints?: any;
}

const list = [
  {id: 1, name: 'General'},
  {id: 2, name: 'Bug'},
  {id: 3, name: 'New Feature Suggestions'},
  {id: 4, name: 'New Event Suggestions'},
];
const FeedbackScreen: React.FC<FeedbackScreenProps> = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState('');

  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.goBack();
  };

  const onConfirm = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={PROFILE.FEEDBACK}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      <ScrollView >
        <View style={styles.contentContainer}>
          <Text style={styles.subTitle}>{PROFILE.FEEDBACK_SUBTITLE}</Text>

          <View style={styles.textareaContainer}>
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

          <Text style={styles.tagText}>Tag</Text>
          <CreativeFocusComponent list={list} />
        </View>
      </ScrollView>
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
    height:'100%'
    
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
    height: 100, // Adjust for the height of the text area
  },
  tagText: {
    fontFamily: fontFamily.RomieTrial_Bold,
    fontSize: 20,
    marginTop: 20,
  },
});
export default FeedbackScreen;
