import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LABLE,
  BUTTON_LABLE,
  ERROR_MESSAGE,
  COLORS,
} from '../../../utils/constants';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Input from '../../../component/Input/Input';
import Header from '../../../component/Header/Header';

import useApi from '../../../axios/useApi';
import { EndPoint } from '../../../ApiManager/config';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  Wp,
} from 'src/utils/dimensions';
import PhoneNumberInput from 'src/component/PhonNumberComponent/PhoneNumberInput';
import GuestForm from './GuestForm';
import { useDispatch } from 'react-redux';
import { addGuest } from 'src/redux/slices/rspvSlice';

interface MyDetailsScreenProps extends NativeStackScreenProps<any, any> { }

const AddGuestScreen: React.FC<MyDetailsScreenProps> = ({ navigation }) => {
  const { apiRequest, loading, error } = useApi();
  const { params } = useRoute();
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);

  const onNextClick = () => {
    firstNameRef.current.validateInputs();
    lastNameRef.current.validateInputs();
    phoneNumberInputRef.current.handleNextPress();
    if (
      firstNameRef.current.validateInputs() &&
      lastNameRef.current.validateInputs() &&
      phoneNumberInputRef.current.handleNextPress()
    ) {
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={LABLE.ADD_GUEST}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <View style={styles.viewContainer}>
        <View style={styles.contentContainer}>
          <Title subTitle={LABLE.ADD_A_PHOTO_SUBTITLE} align="center" />
          <GuestForm data={params?.data} hasPhone onSubmit={(e) => {
            dispatch(addGuest(e))
            navigation.pop(2);
          }} />
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  viewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  btnStyle: {
    width: '85%',
    borderRadius: radiusScale(100),

  },
  contentContainer: {
    flex: 1,
    paddingVertical: verticalMarginScale(10),

  },
  label: {
    paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
  },
});

export default AddGuestScreen;