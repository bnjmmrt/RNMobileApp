import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import IMAGES from '@images/index';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Input, { InputRefMethods } from 'src/component/Input/Input';
import PhoneNumberInput, {
  countryType,
  PhoneNumberInputRefMethods,
} from 'src/component/PhonNumberComponent/PhoneNumberInput';
import { AppStackParamList } from 'src/navigation/AppStack';
import { ROUTES } from 'src/navigation/Route';
import { useAddNewUserMutation } from 'src/redux/actions/usersApiAction';
import { ERROR_MESSAGE } from 'src/utils/constants';
import { verticalMarginScale } from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { styles } from './style';

type existingUserType = {
  hasEmail: boolean;
  hasPhone: boolean;
  message: string;
  user: {
    email: string;
    firstName: string;
    id: string;
    imageUrl: string;
    lastName: string;
    phoneNumber: string;
  };
};

const AddNewUserSheet = forwardRef<
  BottomSheetMethods,
  { onSuccess: () => void }
>(({ onSuccess }, ref) => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const sheetRef = useRef<BottomSheetMethods>(null);
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
    showFlashMessage: (type, message) =>
      sheetRef.current?.showFlashMessage(type, message),
  }));

  const firstNameRef = useRef<InputRefMethods>(null);
  const lastNameRef = useRef<InputRefMethods>(null);
  const phoneNumberRef = useRef<PhoneNumberInputRefMethods>(null);
  const emailRef = useRef<InputRefMethods>(null);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [errorMessage, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<countryType | null>(
    null,
  );
  const [existingUser, setExistingUser] = useState<existingUserType | null>(
    null,
  );

  const [addNewUser, { error, isLoading }] = useAddNewUserMutation();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setExistingUser(null);
    firstNameRef?.current?.setErrorMessage('');
    lastNameRef?.current?.setErrorMessage('');
    phoneNumberRef?.current?.setErrorMessage('');
    emailRef?.current?.setErrorMessage('');
    setError(null);
  };

  const onPressExsitingUser = () => {
    if (existingUser) {
      resetForm();
      navigation.navigate(ROUTES.UserDetail, { user: existingUser.user.id });
      sheetRef?.current?.close();
    }
  };

  const onPressAddUser = async () => {
    firstNameRef?.current?.setErrorMessage('');
    lastNameRef?.current?.setErrorMessage('');
    phoneNumberRef?.current?.setErrorMessage('');
    emailRef?.current?.setErrorMessage('');

    firstNameRef?.current?.validateInputs();
    lastNameRef?.current?.validateInputs();

    if (
      phoneNumberRef?.current?.validatePhoneNumber(
        ERROR_MESSAGE.PLEASE_PROVIDE_EMAIL_OR_PHONE,
      ) ||
      emailRef?.current?.validateInputs()
    ) {
      // phoneNumberRef?.current?.setErrorMessage('');
      setError('');
    } else {
      emailRef.current?.setErrorMessage('');
      setError(ERROR_MESSAGE.PLEASE_PROVIDE_EMAIL_OR_PHONE);
    }

    if (
      firstNameRef?.current?.validateInputs() &&
      lastNameRef?.current?.validateInputs() &&
      (phoneNumberRef?.current?.validatePhoneNumber(
        ERROR_MESSAGE.PLEASE_PROVIDE_EMAIL_OR_PHONE,
      ) ||
        emailRef?.current?.validateInputs())
    ) {
      try {
        // const requestParam = { email, phoneNumber: phone };
        const response = await addNewUser({
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: `${selectedCountry?.dial_code}${phone}`,
        }).unwrap();

        if (response.success) {
          if (response.data.hasEmail || response.data.hasPhone) {
            setExistingUser(response.data);
            if (response.data?.hasEmail) {
              emailRef?.current?.setErrorMessage(
                'This user is already in database, enter a new email',
              );
            }
            if (response.data?.hasPhone) {
              phoneNumberRef?.current?.setErrorMessage(
                'This user is already in database, enter a new phone number',
              );
            }
          } else {
            setExistingUser(null);
            sheetRef?.current?.close();
            resetForm();
            onSuccess();
            FlashMessageComponent.show('success', 'User added successfully!');
          }
        }
      } catch (error) {
        const typedError = error as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      }
    }
  };

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={['88%']}
      enableDynamicSizing={true}
      onClose={() => resetForm()}>
      <BottomSheetScrollView style={styles.container}>
        <CustomText style={styles.title}>{'Add New User'}</CustomText>
        <CustomText style={styles.message}>{'Enter user details'}</CustomText>

        <Input
          ref={firstNameRef}
          errorMessage={ERROR_MESSAGE.FIRST_NAME_REQUIRED}
          label="First Name *"
          defaultValue={firstName}
          onChangeText={text => setFirstName(text)}
          forBottomSheet={true}
        />
        <Input
          ref={lastNameRef}
          errorMessage={ERROR_MESSAGE.LAST_NAME_REQUIRED}
          label="Last Name *"
          defaultValue={lastName}
          onChangeText={text => setLastName(text)}
          forBottomSheet={true}
        />
        <Input
          ref={emailRef}
          errorMessage={''}
          label="Email *"
          placeholder="example@gmail.com"
          defaultValue={email}
          onChangeText={text => setEmail(text)}
          forBottomSheet={true}
          isBackgroundRed={errorMessage == null ? false : true}
        />
        <PhoneNumberInput
          ref={phoneNumberRef}
          label="Phone Number *"
          otherStyle={{ marginTop: 24 }}
          onChangeText={text => setPhone(text)}
          onSelectCountry={setSelectedCountry}
          forBottomSheet={true}
          // errorMsg={errorMessage}
        />

        {existingUser ? (
          <TouchableOpacity
            style={styles.userPreviewContainer}
            onPress={onPressExsitingUser}>
            <AvatarInitials
              name={`${existingUser?.user?.firstName || ''} ${
                existingUser?.user?.lastName || ''
              }`}
              size={48}
              imgUrl={existingUser?.user?.imageUrl}
            />
            <View style={{ flex: 1 }}>
              <CustomText style={styles.userName}>
                {`${existingUser?.user?.firstName} ${existingUser?.user?.lastName}`}
                <Image source={IMAGES.arrow_up_right} />
              </CustomText>
              <CustomText style={styles.alreadyPresent}>
                {'This user is already a part of our database'}
              </CustomText>
            </View>
          </TouchableOpacity>
        ) : null}
        <Button
          title="Add User"
          colorTheme="dark"
          style={[styles.cta, { marginBottom: verticalMarginScale(40) }]}
          onPress={onPressAddUser}
          loading={isLoading}
        />
      </BottomSheetScrollView>
    </BottomSheetComponent>
  );
});

export default AddNewUserSheet;
