import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import IdentityVerificationStyles from './IdentityVerificationStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { persistStore } from 'redux-persist';
import {store} from '../../../redux/store';  // Your store
import { useDispatch } from 'react-redux';
import { resetAppFlowDetails } from '../../../redux/slices/appFlowSlice';

interface IdentityVerificationProps extends NativeStackScreenProps<any, any> { }

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ navigation }) => {
  const styles = IdentityVerificationStyles();
  const dispatch = useDispatch();

  const onNextClick = () => {
    dispatch(resetAppFlowDetails());
  // persistStore(store).purge(); // This clears the persisted state
    navigation.navigate('MyDetailsScreen');
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.IDENTITY_VERIFICATION} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title title={LABLE.IDENTITY_VERIFICATION_TITLE} subTitle={LABLE.IDENTITY_VERIFICATION_SUBTITLE} />
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.SUBMTI_APPLICATION}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </SafeAreaView>
  );
};

export default IdentityVerification;
