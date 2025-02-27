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
import { changeSafeAreaViewConfig, fontFamily } from 'src/utils/functions';
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
import { CustomText } from 'src/component/CustomText';

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
          <CustomText style={[styles.descriptionText]}>Your changes will only be saved in Rumor and will not impact your device’s contact list.</CustomText>
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
  descriptionText: { fontFamily: fontFamily.ABCDiatype_Medium, fontSize: fontScale(14), color: COLORS.light_gray, textAlign: 'center', marginBottom: verticalMarginScale(12), marginHorizontal: horizontalMarginScale(12) },
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
    paddingVertical: verticalMarginScale(10)

  },
  label: {
    paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
  },
});

export default AddGuestScreen;