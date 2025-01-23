import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {LABLE, BUTTON_LABLE, COLORS} from '../../../utils/constants';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';

import Toast from '../../../component/Toast/Toast';
import {Wp} from '../../../utils/dimensions';

interface CreativeFocusComponentProps {}

const CreativeFocusComponent: React.FC<CreativeFocusComponentProps> = () => {
  const dispatch = useDispatch();
  const selectedCreativeFocus = useSelector(
    (state: RootState) => state.appFlow.creativeFocus,
  );
  const creativeFocus = useSelector(
    (state: RootState) => state.appFlowApiData.creativeFocus,
  );

  const [selectedCategories, setSelectedCategories] = useState<any[]>(
    selectedCreativeFocus,
  );

  const [isToastShown, setIsToastShown] = useState(false);

  const handleCategorySelect = (category: any) => {
    console.log(selectedCategories.length);
    if (selectedCategories.find(item => item.id === category.id)) {
      console.log(category);
      if (selectedCategories.length === 1) {
        setIsToastShown(true);
      }
      // Remove category if already selected
      setSelectedCategories(
        selectedCategories.filter((item: any) => item.id !== category.id),
      );
    } else if (selectedCategories.length < 3) {
      // Add category if less than 3 are selected
      console.log(category);
      setIsToastShown(false);
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <>
      <View style={styles.categoryContainer}>
        {creativeFocus?.map(item => (
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
    </>
  );
};

const styles = StyleSheet.create({
 
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryContainer: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: COLORS.lighter_gray,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.black,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
});
export default CreativeFocusComponent;
