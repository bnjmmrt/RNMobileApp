import React, {useRef, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import IMAGES from '../../../assets/images';
import {LABLE, ERROR_MESSAGE, COLORS} from '../../../utils/constants';
import BottomSheetComponent from '../../../component/BottomSheet/BottomSheet';

interface GenderComponentProps {
  selectedGender:(gender:any)=>void,

}

const genderList = [
  {id: 0, gender: 'Male'},
  {id: 1, gender: 'Female'},
  {id: 2, gender: 'Non-binary'},
  {id: 3, gender: 'Prefer not to say'},
];
const GenderComponent: React.FC<GenderComponentProps> = ({selectedGender}) => {
  const genderSheetRef = useRef<any>(null);
  const genderId = useSelector((state: RootState) => state.appFlow.gender);
  const item:any=genderList.find(item => item.id === genderId)
  const [gender, setSelectedGender] = useState<any>(item); // Initialize with birthday from Redux
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openDatePicker = () => {
    genderSheetRef.current?.open(); // Open the date picker
  };

  const validateInputs = () => {
    if (!genderId) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BIRTHDAY);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSelect = (gender:any) => {
    setSelectedGender(gender)
    selectedGender(gender.id)
    genderSheetRef.current?.close();
  };

  return (
    <>
      <CustomSelectableText
        placeholder={LABLE.GENDER}
        rightImage={IMAGES.upDownArrow}
        errorMessage={errorMessage}
        defaultValue={gender?.gender}
        onPress={openDatePicker}
        style={styles.container}
      />

      <BottomSheetComponent
        ref={genderSheetRef}
        snapPoints={[Platform.OS === 'android' ? '40%' : '35%']}
        onClose={() => console.log(genderSheetRef)}>
        <View style={styles.genderContainer}>
          {genderList.map(item => {
            return (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.button}
                onPress={()=>handleSelect(item)}>
                <Text style={styles.buttonText}>{item.gender}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetComponent>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  genderContainer: {
    paddingHorizontal: 12,
  },
  calenderImage: {marginRight: 6, width: 16, height: 16},
  iconContainer: {},

  button: {
    borderWidth: 1,
    borderColor: COLORS.lighter_gray,
    borderRadius: 25,
    // paddingVertical: 10,
    // paddingHorizontal: 40,
    backgroundColor: COLORS.white,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
    padding: 14,
  },
});
export default GenderComponent;
