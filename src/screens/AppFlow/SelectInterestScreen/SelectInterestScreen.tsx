import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectInterestScreenStyles from './SelectInterestScreenStyles';
import Button from '../../../component/Button';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';

interface SelectInterestScreenProps extends NativeStackScreenProps<any, any> { }

const SelectInterestScreen: React.FC<SelectInterestScreenProps> = ({ navigation }) => {
  const styles = SelectInterestScreenStyles();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    'Art', 'Automotive', 'Beauty', 'Business', 'Fashion',
    'Fitness', 'Food', 'Hospitality', 'Humor',
    'Luxury', 'Lifestyle', 'Music', 'Personal Growth',
    'Philanthropy', 'Sports', 'Technology', 'Wellness'
  ];

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      // Remove category if already selected
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else if (selectedCategories.length < 3) {
      // Add category if less than 3 are selected
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const onNextClick = () => {
    if (selectedCategories.length > 0) {
      console.log('Selected Categories:', selectedCategories);
      navigation.navigate('ProfilePhotoScreen');
    } else {
      //   alert('Please select at least one category.');
    }
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.INTERESTS} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.CHOOSE_YOUR_INTERESTS}
          subTitle={LABLE.CHOOSE_YOUR_INTERESTS_SUBTITLE}
        />

        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategories.includes(category) && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategories.includes(category) && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
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

export default SelectInterestScreen;
