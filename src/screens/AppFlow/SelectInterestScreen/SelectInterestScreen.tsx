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
  const interest = useSelector((state: RootState) => state.appFlow.interest);
  const styles = SelectInterestScreenStyles();
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(interest);
  const [isToastShown, setIsToastShown] = useState(false);

  const categories = [
    'Art',
    'Automotive',
    'Beauty',
    'Business',
    'Fashion',
    'Fitness',
    'Food',
    'Hospitality',
    'Humor',
    'Luxury',
    'Lifestyle',
    'Music',
    'Personal Growth',
    'Philanthropy',
    'Sports',
    'Technology',
    'Wellness',
  ];

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      // Remove category if already selected
      setSelectedCategories(
        selectedCategories.filter(item => item !== category),
      );
    } else {
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
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategories.includes(category) &&
                  styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(category)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategories.includes(category) &&
                    styles.selectedCategoryText,
                ]}>
                {category}
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
