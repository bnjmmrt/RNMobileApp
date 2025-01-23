import React, {useRef, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import IMAGES from '../../../assets/images';
import {LABLE, ERROR_MESSAGE, COLORS} from '../../../utils/constants';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';

interface GenderComponentProps {
  // setSelectedDate:(date:Date)=>void,
  // date:Date,
  // setDate:(date:Date)=>void
}

const genderList = [
  {id: 0, gender: 'Male'},
  {id: 1, gender: 'Female'},
  {id: 2, gender: 'Non-binary'},
  {id: 3, gender: 'Prefer not to say'},
];
const GenderComponent: React.FC<GenderComponentProps> = () => {
  const dispatch = useDispatch();
  const genderSheetRef = useRef<any>(null);
  const birthday = useSelector((state: RootState) => state.appFlow.birthday);
  const [selectedDate, setSelectedDate] = useState<string>(birthday); // Initialize with birthday from Redux
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
 ;

  const openDatePicker = () => {
    genderSheetRef.current?.open(); // Open the date picker
  };

  const validateInputs = () => {
    if (!selectedDate) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BIRTHDAY);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handlePress=()=>{}

  return (
    <>
      <CustomSelectableText
        placeholder={LABLE.GENDER}
        leftImage={IMAGES.calender}
        rightImage={IMAGES.upDownArrow}
        errorMessage={errorMessage}
        defaultValue={selectedDate}
        onPress={openDatePicker}
        style={styles.container}
      />

      <BottomSheetComponent
        ref={genderSheetRef}
        snapPoints={[Platform.OS === 'android' ? '35%' : '30%']}
        onClose={() => console.log(genderSheetRef)}>
        <View style={styles.container}>
        {genderList.map(item => {
              return (<TouchableOpacity  key={item.id.toString()} style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>{item.gender}</Text>
              </TouchableOpacity>);
            })}
        </View>
      </BottomSheetComponent>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: 60,
  },
  calenderImage: {marginRight: 6, width: 16, height: 16},
  iconContainer: {},

  button: {
    borderWidth: 1, 
    borderColor: COLORS.lighter_gray, 
    borderRadius: 25, 
    paddingVertical: 10, 
    paddingHorizontal: 40,
    backgroundColor: COLORS.white,
    
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.black, 
    textAlign: 'center',
  },
});
export default GenderComponent;
