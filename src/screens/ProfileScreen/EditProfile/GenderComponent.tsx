import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import IMAGES from '../../../assets/images';
import { LABLE, COLORS } from '../../../utils/constants';
import BottomSheetComponent from '../../../component/BottomSheet/BottomSheet';
import { fontScale, horizontalMarginScale, verticalMarginScale } from 'src/utils/dimensions';

interface GenderComponentProps {
  setGender: (gender: string) => void,
  list: any[];
  selectedGender: string
}

const GenderComponent: React.FC<GenderComponentProps> = ({ selectedGender, list, setGender }) => {
  const genderSheetRef = useRef<any>(null);
  const item: any = list.find(item => item.id === selectedGender)
  const [gender, setSelectedGender] = useState<string>(item);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openDatePicker = () => {
    genderSheetRef.current?.open();
  };

  const handleSelect = (gender: any) => {
    setSelectedGender(gender)
    setGender(gender)
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
          {list.map(item => {
            return (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.button}
                onPress={() => handleSelect(item)}>
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
    paddingHorizontal: horizontalMarginScale(12),
  },
  calenderImage: { marginRight: verticalMarginScale(6), width: horizontalMarginScale(16), height: verticalMarginScale(16) },
  iconContainer: {},

  button: {
    borderWidth: 1,
    borderColor: COLORS.lighter_gray,
    borderRadius: fontScale(25),
    // paddingVertical: 10,
    // paddingHorizontal: 40,
    backgroundColor: COLORS.white,
    marginTop: verticalMarginScale(5),
  },
  buttonText: {
    fontSize: fontScale(16),
    color: COLORS.black,
    textAlign: 'center',
    padding: verticalMarginScale(14),
  },
});
export default GenderComponent;
