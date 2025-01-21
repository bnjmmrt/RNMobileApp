import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import CreativeFocusScreenStyles from './CreativeFocusScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import {LABLE, BUTTON_LABLE} from '../../../utils/constants';
import Header from '../../../component/Header/Header';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {
  setCreativeFocus,
  setPageProgress,
} from '../../../redux/slices/appFlowSlice';
import Toast from '../../../component/Toast/Toast';

interface CreativeFocusScreenProps extends NativeStackScreenProps<any, any> {}

const CreativeFocusScreen: React.FC<CreativeFocusScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const creativeFocus = useSelector(
    (state: RootState) => state.appFlow.creativeFocus,
  );
  const styles = CreativeFocusScreenStyles();
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(creativeFocus);
  const [isToastShown, setIsToastShown] = useState(false);

  const categories = [
    'Actor',
    'Athlete',
    'Artist',
    'Comedian',
    'Content Creator',
    'Designer',
    'Entertainment',
    'Entrepreneur',
    'Filmmaker',
    'Hospitality',
    'Investor',
    'Model',
    'Musician',
    'Philanthropist',
    'Technology',
    'Wellness',
    'Writer',
  ];

  const handleCategorySelect = (category: string) => {
    
    if (selectedCategories.includes(category)) {
      if(selectedCategories.length===1){
        setIsToastShown(true)
      }
      // Remove category if already selected
      setSelectedCategories(
        selectedCategories.filter(item => item !== category),
      );
    } else if (selectedCategories.length < 3) {
      // Add category if less than 3 are selected
      setIsToastShown(false)
      setSelectedCategories([...selectedCategories, category]);
    }
    
  };

  const onNextClick = () => {
    if (selectedCategories.length > 0) {
      setIsToastShown(false);
      console.log('Selected Categories:', selectedCategories);
      dispatch(setCreativeFocus(selectedCategories));
      dispatch(setPageProgress(7));
      navigation.navigate('SelectInterestScreen');
    } else {
      setIsToastShown(true);
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(5));
    navigation.navigate('BaseCityScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.CREATIVE_FOCUS} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHAT_IS_YOUR_CREATIVE_OR_PROFESSIONAL_FOCUS}
          subTitle={LABLE.YOU_CAN_CHOOSE_UP_TO_3_CATEGORIES}
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

export default CreativeFocusScreen;
