import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../../../utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, Wp} from '../../../utils/dimensions';

interface CreativeFocusComponentProps {
  list?:any[];
  setIsToastShown:(isShown:boolean)=>void;
  getSelectedData:(data:any[])=>void;
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


  const getFilteredData=(list:any[],categoryId:string)=>{
    return list.filter((item: any) => item.id !== categoryId)
  }
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
      const filteredList=getFilteredData(selectedCategories,category.id)
      if (selectedCategories.find(item => item.id === category.id)) {
        // Remove category if already selected
        setSelectedCategories(filteredList);
        
        getSelectedData( filteredList);
        if (filteredList.length === 0) {
          setIsToastShown(true);
        }
      } else if (selectedCategories.length < 3) {
       
        setIsToastShown(false);
        setSelectedCategories([...selectedCategories, category]);
        getSelectedData([...selectedCategories, category]);
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
    paddingHorizontal:horizontalMarginScale(20),
    paddingVertical:verticalMarginScale(10),
  },
  categoryContainer: {
    marginTop:verticalMarginScale(6),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius:radiusScale(20),
    paddingVertical:verticalMarginScale(10),
    paddingHorizontal:horizontalMarginScale(15),
    margin: verticalMarginScale(2),
    backgroundColor: COLORS.lighter_gray,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  categoryText: {
    fontSize:fontScale(14),
    color: COLORS.black,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius:radiusScale(100),
  },
});
export default CreativeFocusComponent;
