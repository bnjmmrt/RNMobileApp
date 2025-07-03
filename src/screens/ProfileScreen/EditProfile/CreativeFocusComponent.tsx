import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';

interface Category {
  id: string;
  name: string;
  targetIndustries: { id: string; name: string }[];
}

interface CreativeFocusComponentProps {
  list?: Category[];
  setIsToastShown: (isShown: boolean) => void;
  getSelectedData: (data: any[]) => void;
  defaultSelected?: { id: string; name: string }[];
}

const CreativeFocusComponent: React.FC<CreativeFocusComponentProps> = ({
  list,
  setIsToastShown,
  getSelectedData,
  defaultSelected = [],
}) => {
  const creativeFocus = useSelector(
    (state: RootState) => state.appFlowApiData.creativeFocus,
  );
  const [selectedCategories, setSelectedCategories] = useState<{ id: string; name: string }[]>(defaultSelected);
  const itemList = list || creativeFocus;

  useEffect(() => {
    setSelectedCategories(defaultSelected);
  }, [JSON.stringify(defaultSelected)]);

  const handleCategorySelect = (profession: { id: string; name: string }) => {
    const alreadySelected = selectedCategories.some(item => item.id === profession.id);
    let updated;
    if (alreadySelected) {
      updated = selectedCategories.filter(item => item.id !== profession.id);
    } else if (selectedCategories.length < 3) {
      updated = [...selectedCategories, profession];
    } else {
      setIsToastShown(true);
      return;
    }
    setSelectedCategories(updated);
    getSelectedData(updated);
    setIsToastShown(updated.length === 0);
  };

  return (
    <>
      {itemList?.map(category => (
        <View key={category.id} style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{category.name}</Text>
          <View style={styles.categoryContainer}>
            {category.targetIndustries?.map(profession => (
              <TouchableOpacity
                key={profession.id}
                style={[
                  styles.categoryButton,
                  selectedCategories.some(selected => selected.id === profession.id) &&
                    styles.selectedCategoryButton,
                ]}
                onPress={() => handleCategorySelect(profession)}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.some(selected => selected.id === profession.id) &&
                      styles.selectedCategoryText,
                  ]}>
                  {profession.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 6,
    marginTop: 12,
  },
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
    margin: 2,
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
    width: '85%',
    borderRadius: 100,
  },
});
export default CreativeFocusComponent;
