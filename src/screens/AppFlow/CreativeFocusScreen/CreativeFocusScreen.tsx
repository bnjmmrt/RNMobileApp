import React, { useCallback, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import Input from '../../../component/Input/Input';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { InputRefMethods } from '../../../component/Input/Input';
import IMAGES from '../../../assets/images';
import { useGetIndustryCategoriesQuery } from 'src/redux/actions/appFlowApiAction';
import Svg, { Path } from 'react-native-svg';

interface CreativeFocusScreenProps extends NativeStackScreenProps<any, any> { }

// Custom CollapsibleView component with controlled state
interface CustomCollapsibleViewProps {
  title: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  styles: any;
}

const CustomCollapsibleView: React.FC<CustomCollapsibleViewProps> = ({
  title,
  children,
  isExpanded,
  styles,
}) => {
  return (
    <View style={styles.collapsibleContainer}>
      {title}
      {isExpanded && children}
    </View>
  );
};

// No Results component
interface NoResultsProps {
  styles: any;
}

const NoResults: React.FC<NoResultsProps> = ({ styles }) => {
  return (
    <View style={styles.noResultsContainer}>
      <Image source={IMAGES.noRecord} style={styles.noResultsLogo} />
      <Text style={styles.noResultsTitle}>No results</Text>
      <Text style={styles.noResultsSubtitle}>Please refine your search</Text>
    </View>
  );
};

// Arrow SVG components
const ArrowUpIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M7.52851 5.52925C7.78886 5.2689 8.21097 5.2689 8.47132 5.52925L12.4713 9.52925C12.7317 9.7896 12.7317 10.2117 12.4713 10.4721C12.211 10.7324 11.7889 10.7324 11.5285 10.4721L7.99992 6.94346L4.47132 10.4721C4.21097 10.7324 3.78886 10.7324 3.52851 10.4721C3.26816 10.2117 3.26816 9.7896 3.52851 9.52925L7.52851 5.52925Z" fill="#1F1F1F" />
  </Svg>
);

const ArrowDownIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M3.52851 5.52925C3.78886 5.2689 4.21097 5.2689 4.47132 5.52925L7.99992 9.05784L11.5285 5.52925C11.7889 5.2689 12.211 5.2689 12.4713 5.52925C12.7317 5.7896 12.7317 6.21171 12.4713 6.47206L8.47132 10.4721C8.21097 10.7324 7.78886 10.7324 7.52851 10.4721L3.52851 6.47206C3.26816 6.21171 3.26816 5.7896 3.52851 5.52925Z" fill="#1F1F1F" />
  </Svg>
);

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
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<InputRefMethods>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    Business: false,
    Entertainment: false,
    'Fashion & Design': false,
    Hospitality: false,
    'Sports & Wellness': false,
  });

  const [isToastShown, setIsToastShown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data: industryCategoriesData, isSuccess: isIndustryCategoriesSuccess } = useGetIndustryCategoriesQuery();
  // industryCategoriesData is an array of { id, name, targetIndustries: [{id, name}] }

  // Filter and categorize items from backend
  const getFilteredCategories = () => {
    if (!industryCategoriesData) return [];
    return industryCategoriesData.map(category => ({
      ...category,
      targetIndustries: category.targetIndustries.filter((item: any) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    })).filter(category => category.targetIndustries.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  // Check if there are any results
  const hasResults = filteredCategories.length > 0;

  const handleCategorySelect = (category: any) => {
    if (selectedCategories.find(item => item.id === category.id)) {
      if (selectedCategories.length === 1) {
        setToastMessage(ERROR_MESSAGE.CREATIVE_FOCUS);
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
    } else {
      // Show message when trying to select 4th category
      setToastMessage('You have selected the maximum amount of categories');
      setIsToastShown(true);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const handleClearSearch = () => {
    setSearchText('');
    // Reset search input if using ref
    if (searchInputRef.current) {
      searchInputRef.current.setInputText('');
    }
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const renderCollapsibleHeader = (categoryName: string, itemCount: number, isExpanded: boolean) => {
    return (
      <TouchableOpacity
        style={styles.categoryHeaderContainer}
        onPress={() => toggleSection(categoryName)}
        activeOpacity={0.7}>
        <Text style={styles.categoryHeaderText}>{categoryName}</Text>
        <View style={styles.categoryHeaderCountContainer}>
          <View style={styles.categoryHeaderCount}>
            <Text style={styles.categoryHeaderCountText}>{itemCount}</Text>
          </View>
          <View style={styles.arrowContainer}>
            {isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItems = (items: any[]) => {
    return (
      <View style={styles.categoryContainer}>
        {items.map(item => (
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
                selectedCategories.some(selected => selected.id === item.id) &&
                styles.selectedCategoryText,
              ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const onNextClick = () => {
    if (selectedCategories.length > 0 && selectedCategories.length <= 3) {
      setIsToastShown(false);
      dispatch(setCreativeFocus(selectedCategories));
      dispatch(setPageProgress(7));
      navigation.navigate('CompanyScreen');
    } else {
      setToastMessage(ERROR_MESSAGE.CREATIVE_FOCUS);
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
      <Header headerTitle={LABLE.PROFESSION} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHAT_IS_YOUR_PROFESSIONAL_FOCUS}
          subTitle={LABLE.YOU_CAN_CHOOSE_UP_TO_3_CATEGORIES}
        />
        <Input
          ref={searchInputRef}
          placeholder={LABLE.SEARCH_PROFESSION}
          errorMessage={''}
          onChangeText={handleSearchTextChange}
          leftImage={IMAGES.search}
          rightImage={searchText.length > 0 ? IMAGES.clear : null}
          onPressImage={searchText.length > 0 ? handleClearSearch : undefined}
        // style={styles.searchInput}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>

          {!hasResults ? (
            <NoResults styles={styles} />
          ) : (
            filteredCategories.map(category => (
              <CustomCollapsibleView
                key={category.id}
                title={renderCollapsibleHeader(category.name, category.targetIndustries.length, expandedSections[category.name])}
                isExpanded={expandedSections[category.name]}
                styles={styles}>
                {expandedSections[category.name] &&
                  renderCategoryItems(category.targetIndustries)}
              </CustomCollapsibleView>
            ))
          )}
        </ScrollView>

        {isToastShown && (
          <Toast
            // eslint-disable-next-line react-native/no-inline-styles
            toastStyle={{
              position: 'relative',
              bottom: BOTTOM_SAFEAREA_SPACING + 10,
              right: 0,
              left: 0,
            }}
            message={toastMessage}
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
