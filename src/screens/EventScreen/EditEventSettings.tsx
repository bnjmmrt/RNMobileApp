import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import useApi from 'src/axios/useApi';
import { BUTTON_LABLE, COLORS, editEventsTab, ERROR_MESSAGE, EVENT, LABLE } from 'src/utils/constants';
import { TabItem } from 'src/component/ActiveTabBar/DynamicTabBar';
import { EndPoint } from 'src/ApiManager/config';
import Input from 'src/component/Input/Input';
import DatePickerComponent from '../ProfileScreen/EditProfile/DatePickerComponent';
import Button from 'src/component/Button';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale } from 'src/utils/dimensions';
import BaseCityComponent from '../ProfileScreen/EditProfile/BaseCityComponent';


interface EditEventSettingsProps {
  eventId: string;
}

const EditEventSettings: React.FC<EditEventSettingsProps> = ({
  eventId,
}) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState<TabItem>(editEventsTab[0]);



  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const profileData = useSelector(
    (state: RootState) => state.appFlowApiData?.profileData,
  );
  const userId = useSelector((state: RootState) => state.auth.userId);

  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const baseCityRef = useRef<any>(null);
  const birthDayRef = useRef<any>(null);


  const onConfirmClick = async () => {
    if (
      firstNameRef.current.validateInputs() &&
      lastNameRef.current.validateInputs() &&
      birthDayRef.current.validateBirthDate() &&
      baseCityRef.current.validateBaseCity()
    ) {
      const requestObject: any = {
        address: {
          address: baseCityRef.current.selectedCity.address,
          city: '',
          latitude: '',
          longitude: '',
          placeId: baseCityRef.current.selectedCity.placeId,
          regionCode: '',
        },
        birthDate: birthDayRef.current.selectedDate,//convertDateFormat(birthDayRef.current.selectedDate),
        firstName: firstNameRef.current.inputText,
        lastName: lastNameRef.current.inputText,

      };
      console.log('requestObject', requestObject);

      const response: any = await apiRequest(
        'put',
        EndPoint.user_profile + userId,
        requestObject,
      );
      if (response.status === 200) {
        const responseUser: any = await apiRequest(
          'get',
          EndPoint.user + userId,
        );
        if (responseUser.status === 200) {
          dispatch(setProfileData(responseUser?.data));
        }
        FlashMessageComponent.show('success', 'Profile Updated Successfully');
        handleBackPress();
      }
    }
  };

  const handleBackPress = () => {
    // navigation.goBack()
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Input
            ref={firstNameRef}
            label={LABLE.FIRST_NAME}
            errorMessage={ERROR_MESSAGE.FIRST_NAME}
            defaultValue={profileData?.firstName}
          />
          <Input
            ref={lastNameRef}
            label={LABLE.LAST_NAME}
            errorMessage={ERROR_MESSAGE.LAST_NAME}
            defaultValue={profileData?.lastName}
          />



          {!loginData?.isInvited && (
            <View>

              <Text style={[styles.label]}>{LABLE.BIRTHDAY}</Text>
              <DatePickerComponent ref={birthDayRef} birthDate={profileData.dateOfBirth} />

              <Text style={[styles.label]}>{LABLE.BASE_CITY}</Text>
              <BaseCityComponent ref={baseCityRef} />


            </View>
          )}

        </View>

      </ScrollView>


      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.CONFIRM}
        colorTheme="dark"
        onPress={onConfirmClick}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingBottom: 20
  },
  btnStyle: {
    borderRadius: radiusScale(100),
    bottom: verticalMarginScale(20),
  },
  contentContainer: {
    flex: 1,
    // paddingVertical: verticalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(20),
  },
  scrollContainer: { paddingBottom: verticalMarginScale(40) },
  label: {
    // paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
    color: COLORS.black,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default EditEventSettings;
