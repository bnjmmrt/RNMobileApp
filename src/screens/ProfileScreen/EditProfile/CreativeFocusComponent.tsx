import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../../../utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {Wp} from '../../../utils/dimensions';
import { Tag } from './FeedbackScreen';

interface CreativeFocusComponentProps {
  list?:any[];
  setIsToastShown:(isShown:boolean)=>void;
  getSelectedData:(data:Tag[])=>void;
}

const CreativeFocusComponent: React.FC<CreativeFocusComponentProps> = ({list,setIsToastShown,getSelectedData}) => {
  const dispatch = useDispatch();

  const selectedCreativeFocus = useSelector(
    (state: RootState) => state.appFlow.creativeFocus,
  );
  const creativeFocus = useSelector(
    (state: RootState) => state.appFlowApiData.creativeFocus,
  );

  const [selectedCategories, setSelectedCategories] = useState<any[]>(
   list ? [] : selectedCreativeFocus,
  );

  const [itemList,_setItemLiist]=useState(list ? list : creativeFocus)

  const handleCategorySelect = (category: any) => {
    if (list?.length) {
      // When list data is available, allow only one selection
      if (selectedCategories.some(item => item.id === category.id)) {
        // Deselect if already selected
        setSelectedCategories([]);
        getSelectedData([]);
        setIsToastShown(true);
        
      } else {
        // Select the current category
        setSelectedCategories([category]);
        getSelectedData([category]);
        setIsToastShown(false);
       
      }
    } else {
      // Original logic for multiple selection
      if (selectedCategories.find(item => item.id === category.id)) {
        if (selectedCategories.length === 0) {
          setIsToastShown(true);
        }
        // Remove category if already selected
        setSelectedCategories(
          selectedCategories.filter((item: any) => item.id !== category.id),
        );
        getSelectedData(selectedCategories);
      } else if (selectedCategories.length < 3) {
        getSelectedData(selectedCategories);
        setIsToastShown(false);
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };

  return (
    <>
      <View style={styles.categoryContainer}>
        {itemList?.map(item => (
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
    width: Wp(85),
    borderRadius: 100,
  },
});
export default CreativeFocusComponent;
