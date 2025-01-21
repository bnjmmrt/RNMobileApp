import React, {useState} from 'react';
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

interface SelectInterestScreenProps extends NativeStackScreenProps<any, any> {}

const SelectInterestScreen: React.FC<SelectInterestScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
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
    if (selectedCategories.find(item=> item.id===category.id)) {
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
    if (selectedCategories.length > 0) {
      setIsToastShown(false);
      console.log('Selected Categories:', selectedCategories);
      dispatch(setInterest(selectedCategories));
      dispatch(setPageProgress(8));
      navigation.navigate('ProfilePhotoScreen');
    } else {
      setIsToastShown(true);
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(6));
    navigation.navigate('CreativeFocusScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.INTERESTS} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.CHOOSE_YOUR_INTERESTS}
          subTitle={LABLE.CHOOSE_YOUR_INTERESTS_SUBTITLE}
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
                         selectedCategories.some(selected => selected.id === item.id) &&
                           styles.selectedCategoryText,
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
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </SafeAreaView>
  );
};

export default SelectInterestScreen;
