import React, {forwardRef} from 'react';
import {Image, ScrollView, View} from 'react-native';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import {CustomText} from 'src/component/CustomText';
import Input from 'src/component/Input/Input';
import PhoneNumberInput from 'src/component/PhonNumberComponent/PhoneNumberInput';
import {verticalScale} from 'src/utils/dimensions';
import {styles} from './style';
import Button from 'src/component/Button';
import AvatarInitials from 'src/component/AvatarInitials';
import IMAGES from '@images/index';

const AddNewUserSheet = forwardRef((props, ref) => {
  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[`${verticalScale(75)}%`]} // Adjustable snap points
      onClose={() => console.log('Bottom sheet closed')}>
      <ScrollView style={styles.container}>
        <CustomText style={styles.title}>{'Add New User'}</CustomText>
        <CustomText style={styles.message}>{'Enter user details'}</CustomText>

        <Input errorMessage={'ssse'} label="First Name *" defaultValue="" />
        <Input errorMessage={''} label="Last Name *" />
        <Input
          errorMessage={''}
          label="Email"
          placeholder="example@gmail.com"
        />
        <PhoneNumberInput label="Phone Number" otherStyle={{marginTop: 24}} />

        <View style={styles.userPreviewContainer}>
          <AvatarInitials name="Steave" size={48} />
          <View style={{flex: 1}}>
            <CustomText style={styles.userName}>
              {'Steve Jobs'} <Image source={IMAGES.arrow_up_right} />
            </CustomText>
            <CustomText style={styles.alreadyPresent}>
              {'This user is already a part of our database'}
            </CustomText>
          </View>
        </View>
        <Button
          title="Add User"
          colorTheme="dark"
          style={styles.cta}
          onPress={() => {}}
        />
      </ScrollView>
    </BottomSheetComponent>
  );
});

export default AddNewUserSheet;
