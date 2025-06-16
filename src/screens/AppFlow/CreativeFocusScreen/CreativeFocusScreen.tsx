import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreativeFocusScreenStyles from './CreativeFocusScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import { LABLE, BUTTON_LABLE, ERROR_MESSAGE } from '../../../utils/constants';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import {
  setCreativeFocus,
  setPageProgress,
} from '../../../redux/slices/appFlowSlice';
import Toast from '../../../component/Toast/Toast';
import { useGetFocusesQuery } from '../../../redux/actions/appFlowApiAction';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { Hp } from 'src/utils/dimensions';

interface CreativeFocusScreenProps extends NativeStackScreenProps<any, any> { }

const CreativeFocusScreen: React.FC<CreativeFocusScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const selectedCreativeFocus = useSelector(
    (state: RootState) => state.appFlow.creativeFocus,
  );
  const creativeFocus = useSelector(
    (state: RootState) => state.appFlowApiData.creativeFocus,
  );
  const styles = CreativeFocusScreenStyles();
  const [selectedCategories, setSelectedCategories] = useState<any[]>(
    selectedCreativeFocus,
  );

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
    } else if (selectedCategories.length < 3) {
      // Add category if less than 3 are selected
      setIsToastShown(false);
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const onNextClick = () => {
    if (selectedCategories.length > 0 && selectedCategories.length <= 3) {
      setIsToastShown(false);
      dispatch(setCreativeFocus(selectedCategories));
      dispatch(setPageProgress(7));
      navigation.navigate('SelectInterestScreen');
    } else {
      setIsToastShown(true);
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(5));
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header headerTitle={LABLE.CREATIVE_FOCUS} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHAT_IS_YOUR_CREATIVE_OR_PROFESSIONAL_FOCUS}
          subTitle={LABLE.YOU_CAN_CHOOSE_UP_TO_3_CATEGORIES}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 0.6 }} >

          <View style={styles.categoryContainer}>
            {creativeFocus?.map(item => (
              <TouchableOpacity
                activeOpacity={0.7}
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


        </ScrollView>

        {isToastShown && (
          <Toast
            toastStyle={{ position: 'relative', bottom: BOTTOM_SAFEAREA_SPACING + 10, right: 0, left: 0 }}
            message={ERROR_MESSAGE.CREATIVE_FOCUS}
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

export default CreativeFocusScreen;
