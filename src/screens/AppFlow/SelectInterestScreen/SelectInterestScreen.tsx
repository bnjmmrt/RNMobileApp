import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import SelectInterestScreenStyles from './SelectInterestScreenStyles';
import Button from '../../../component/Button';
import {LABLE, BUTTON_LABLE} from '../../../utils/constants';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {setInterest, setPageProgress} from '../../../redux/slices/appFlowSlice';
import Toast from '../../../component/Toast/Toast';
import {useFocusEffect} from '@react-navigation/native';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';

interface SelectInterestScreenProps extends NativeStackScreenProps<any, any> {}

const SelectInterestScreen: React.FC<SelectInterestScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const [configData, setConfigData] = useState(
    route.params
      ? route.params
      : {
          headerTitle: null,
          btnTitle: null,
          subTitle: null,
          fromProfile: false,
        },
  );
  const interest = useSelector(
    (state: RootState) => state.appFlowApiData.interests,
  );
  const selectedInterests = useSelector(
    (state: RootState) => state.appFlow.interest,
  );
  const styles = SelectInterestScreenStyles();
  const [selectedCategories, setSelectedCategories] =
    useState<any[]>(selectedInterests);

  const [isToastShown, setIsToastShown] = useState(false);

  const handleCategorySelect = (category: any) => {
    if (selectedCategories.find(item => item.id === category.id)) {
      if (selectedCategories.length === 1) {
        setIsToastShown(true);
      }
      // Remove category if already selected
      setSelectedCategories(
        selectedCategories.filter((item: any) => item.id !== category.id),
      );
    } else {
      setIsToastShown(false);
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const onNextClick = () => {
    if (!configData.fromProfile) {
      if (selectedCategories.length > 0) {
        setIsToastShown(false);
        console.log('Selected Categories:', selectedCategories);
        dispatch(setInterest(selectedCategories));
        dispatch(setPageProgress(8));
        navigation.navigate('ProfilePhotoScreen');
      } else {
        setIsToastShown(true);
      }
    } else {
      //handle edit profile flow
    }
  };

  const handleBackPress = () => {
    if (!configData.fromProfile) {
      dispatch(setPageProgress(6));
      navigation.navigate('CreativeFocusScreen');
    } else {
      navigation.goBack();
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header
        headerTitle={
          configData.headerTitle ? configData.headerTitle : LABLE.INTERESTS
        }
        onPress={handleBackPress}
        showProgressBar={!configData.fromProfile}
      />

      <View style={styles.contentContainer}>
        <Title
          title={!configData.fromProfile ? LABLE.CHOOSE_YOUR_INTERESTS : ''}
          subTitle={
            configData.subTitle
              ? configData.subTitle
              : LABLE.CHOOSE_YOUR_INTERESTS_SUBTITLE
          }
        />

        <View style={styles.categoryContainer}>
          {interest?.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryButton,
                selectedCategories.some(selected => selected.id === item.id) &&
                  styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(item)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategories.some(
                    selected => selected.id === item.id,
                  ) && styles.selectedCategoryText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {isToastShown && (
          <Toast
            message={'Please select at least one'}
            onClose={() => setIsToastShown(false)}
          />
        )}
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={configData.btnTitle ? configData.btnTitle : BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </View>
  );
};

export default SelectInterestScreen;
