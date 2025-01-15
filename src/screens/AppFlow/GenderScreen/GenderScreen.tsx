import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LABLE, BUTTON_LABLE} from '../../../utils/constants';
import GenderScreenStyles from './GenderScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import { setGender, setPageProgress } from '../../../redux/slices/appFlowSlice';

interface GenderScreenProps extends NativeStackScreenProps<any, any> {}

const GenderScreen: React.FC<GenderScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const gender = useSelector((state: RootState) => state.appFlow.gender);
  const styles = GenderScreenStyles();
  const [selectedGender, setSelectedGender] = useState<string | null>(gender);

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const onNextClick = () => {
    if (selectedGender) {
      dispatch(setGender(selectedGender));
      dispatch(setPageProgress(4));
      navigation.navigate('BirthdayScreen');
    } else {
      // alert('Please select a gender.');
    }
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
     <Header headerTitle={LABLE.GENDER} onPress={handleBackPress}/>
      <View style={styles.contentContainer}>
        <Title title={LABLE.WHATS_YOUR_GENDER} subTitle={LABLE.SELECT_THE_OPTION_THAT_BEST_DESCRIBES_YOU} />

        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(
            (gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderButton,
                  selectedGender === gender && styles.selectedGenderButton,
                ]}
                onPress={() => handleGenderSelect(gender)}>
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === gender && styles.selectedGenderText,
                  ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </SafeAreaView>
  );
};

export default GenderScreen;
