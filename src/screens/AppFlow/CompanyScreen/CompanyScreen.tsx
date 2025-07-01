import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import CompanyScreenStyles from './CompanyScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import Input from '../../../component/Input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import { setCompany, setPageProgress } from '../../../redux/slices/appFlowSlice';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

interface CompanyScreenProps extends NativeStackScreenProps<any, any> {}

const CompanyScreen: React.FC<CompanyScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const company = useSelector((state: RootState) => state.appFlow.company);
  const styles = CompanyScreenStyles();
  const [companyName, setCompanyName] = useState<string>(company);

  const handleCompanyChange = (text: string) => {
    setCompanyName(text);
  };

  const onNextClick = () => {
    dispatch(setCompany(companyName));
    dispatch(setPageProgress(8));
    navigation.navigate('SelectInterestScreen');
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(6));
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header headerTitle="Company" onPress={handleBackPress} showProgressBar />
      
      <View style={styles.contentContainer}>
        <Title
          title="What company do you work for?"
          subTitle="Tell us about your workplace (optional)"
        />

        <Input
          placeholder="Enter company name"
          value={companyName}
          onChangeText={handleCompanyChange}
          errorMessage=""
          style={styles.inputStyle}
        />
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

export default CompanyScreen; 