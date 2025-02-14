import {BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';
import IMAGES from '@images/index';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import {FlashMessageComponent} from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Input, {InputRefMethods} from 'src/component/Input/Input';
import PhoneNumberInput, {
  countryType,
  PhoneNumberInputRefMethods,
} from 'src/component/PhonNumberComponent/PhoneNumberInput';
import {AppStackParamList} from 'src/navigation/AppStack';
import {ROUTES} from 'src/navigation/Route';
import {useAddNewUserMutation} from 'src/redux/actions/usersApiAction';
import {verticalMarginScale, verticalScale} from 'src/utils/dimensions';
import {ApiErrorInterface, getErrorMessage} from 'src/utils/functions';
import {styles} from './style';
import GradientSeprator from 'src/component/GradientSeprator';

const FilterAccordian = ({
  children,
  title,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <BottomSheetView
      style={[
        styles.accordianContainer,
        isOpen && {paddingBottom: verticalMarginScale(16)},
      ]}>
      <TouchableOpacity
        style={styles.accordianTitleContainer}
        onPress={() => setIsOpen(!isOpen)}>
        <CustomText style={styles.accordianTitle}>{title}</CustomText>
        <View style={styles.accordianArrowContainer}>
          <Image
            source={IMAGES.arrowRight}
            style={{transform: [{rotate: isOpen ? '270deg' : '90deg'}]}}
          />
        </View>
      </TouchableOpacity>
      {isOpen ? children : null}
    </BottomSheetView>
  );
};

export default FilterAccordian;
