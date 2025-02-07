import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Image, ScrollView, View} from 'react-native';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Input from 'src/component/Input/Input';
import PhoneNumberInput, {
  countryType,
} from 'src/component/PhonNumberComponent/PhoneNumberInput';
import {
  useAddNewUserMutation,
  useLazyFetchAllUsersQuery,
} from 'src/redux/actions/usersApiAction';
import {verticalScale} from 'src/utils/dimensions';
import {styles} from './style';
import {FlashMessageComponent} from 'src/component/FlashMessageComponent/FlashMessageComponent';
import AvatarInitials from 'src/component/AvatarInitials';
import IMAGES from '@images/index';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

const AddNewUserSheet = forwardRef<BottomSheetMethods>(({}, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
    showFlashMessage: (type, message) =>
      sheetRef.current?.showFlashMessage(type, message),
  }));

  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const phoneNumberRef = useRef<any>(null);
  const emailRef = useRef<any>(null);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<countryType | null>(
    null,
  );

  const [addNewUser, {error, isLoading}] = useAddNewUserMutation();
  const [
    fetchUsers,
    {data, error: fetchUserError, isLoading: fetchUserLoading},
  ] = useLazyFetchAllUsersQuery();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  const onPressAddUser = async () => {
    firstNameRef.current.validateInputs();
    lastNameRef.current.validateInputs();
    phoneNumberRef.current.validatePhoneNumber();
    emailRef.current.validateInputs();
    if (
      firstNameRef.current.validateInputs() &&
      lastNameRef.current.validateInputs() &&
      phoneNumberRef.current.validatePhoneNumber() &&
      emailRef.current.validateInputs()
    ) {
      try {
        // const requestParam = { email, phoneNumber: phone };
        const response = await addNewUser({
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: `${selectedCountry?.dial_code}${phone}`,
        }).unwrap();

        if (response.status === 200) {
          sheetRef?.current?.close();
          resetForm();
          fetchUsers({skip: 0, take: 10});
          setTimeout(() => {
            FlashMessageComponent.show('success', 'User added successfully!');
          }, 1000);
        }
      } catch (error) {
        sheetRef?.current?.showFlashMessage('error', 'Something went wrong!');
      }
    }
  };

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={[`${verticalScale(65)}%`]} // Adjustable snap points
      onClose={() => {}}>
      <BottomSheetScrollView style={styles.container}>
        <CustomText style={styles.title}>{'Add New User'}</CustomText>
        <CustomText style={styles.message}>{'Enter user details'}</CustomText>

        <Input
          ref={firstNameRef}
          errorMessage={'Please enter first name'}
          label="First Name *"
          defaultValue={firstName}
          onChangeText={text => setFirstName(text)}
          forBottomSheet={true}
        />
        <Input
          ref={lastNameRef}
          errorMessage={'Please enter last name'}
          label="Last Name *"
          defaultValue={lastName}
          onChangeText={text => setLastName(text)}
          forBottomSheet={true}
        />
        <Input
          ref={emailRef}
          errorMessage={'Please enter email'}
          label="Email *"
          placeholder="example@gmail.com"
          defaultValue={email}
          onChangeText={text => setEmail(text)}
          forBottomSheet={true}
        />
        <PhoneNumberInput
          ref={phoneNumberRef}
          label="Phone Number *"
          otherStyle={{marginTop: 24}}
          onChangeText={text => setPhone(text)}
          onSelectCountry={setSelectedCountry}
          forBottomSheet={true}
        />

        {/* <View style={styles.userPreviewContainer}>
          <AvatarInitials name="Steave" size={48} />
          <View style={{flex: 1}}>
            <CustomText style={styles.userName}>
              {'Steve Jobs'} <Image source={IMAGES.arrow_up_right} />
            </CustomText>
            <CustomText style={styles.alreadyPresent}>
              {'This user is already a part of our database'}
            </CustomText>
          </View>
        </View> */}
        <Button
          title="Add User"
          colorTheme="dark"
          style={[styles.cta, {marginBottom: 20}]}
          onPress={onPressAddUser}
          loading={isLoading}
        />
      </BottomSheetScrollView>
    </BottomSheetComponent>
  );
});

export default AddNewUserSheet;
