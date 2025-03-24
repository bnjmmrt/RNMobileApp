import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LABLE, BUTTON_LABLE, genderList } from '../../../utils/constants';
import GenderScreenStyles from './GenderScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import { setGender, setPageProgress } from '../../../redux/slices/appFlowSlice';
import Toast from '../../../component/Toast/Toast';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

// const genderList = [
//   { id: 'MALE', gender: 'Male'},
//   { id: 'FEMALE', gender: 'Female'},
//   { id: 'NON_BINARY', gender: 'Non-binary'},
//   { id: 'UNRECOGNIZED', gender: 'Prefer not to say'},
// ];
interface GenderScreenProps extends NativeStackScreenProps<any, any> { }

const GenderScreen: React.FC<GenderScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const gender = useSelector((state: RootState) => state.appFlow.gender);
  const styles = GenderScreenStyles();
  const [selectedGender, setSelectedGender] = useState<string>(gender);
  const [isToastShown, setIsToastShown] = useState(false);

  const handleGenderSelect = (gender: number) => {
    setIsToastShown(false);
    setSelectedGender(gender);
  };

  const onNextClick = () => {
    if (selectedGender) {
      setIsToastShown(false);
      dispatch(setGender(selectedGender));
      dispatch(setPageProgress(4));
      navigation.navigate('BirthdayScreen');
    } else {
      setIsToastShown(true);
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(1));
    navigation.pop(1)
    navigation.goBack();
    // navigation.navigate('MyDetailsScreen');
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header headerTitle={LABLE.GENDER} onPress={handleBackPress} />
      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHATS_YOUR_GENDER}
          subTitle={LABLE.SELECT_THE_OPTION_THAT_BEST_DESCRIBES_YOU}
        />

        <View style={styles.genderContainer}>
          {genderList.map(gender => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={gender.id}
              style={[
                styles.genderButton,
                selectedGender === gender.id && styles.selectedGenderButton,
              ]}
              onPress={() => handleGenderSelect(gender.id)}>
              <Text
                style={[
                  styles.genderText,
                  selectedGender === gender.id && styles.selectedGenderText,
                ]}>
                {gender.gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {isToastShown && (
          <Toast
            message={LABLE.PLEASE_SELECT_ONE}
            onClose={() => setIsToastShown(false)}
          />
        )}
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </View>
  );
};

export default GenderScreen;
