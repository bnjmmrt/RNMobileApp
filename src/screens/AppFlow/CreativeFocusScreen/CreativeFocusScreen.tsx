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

interface CreativeFocusScreenProps extends NativeStackScreenProps<any, any> {}

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

  // Define categories and their mapping
  const categories = {
    Business: [
      'business',
      'entrepreneur',
      'finance',
      'marketing',
      'consulting',
      'sales',
      'management',
      'startup',
      'corporate',
      'strategy',
    ],
    Entertainment: [
      'entertainment',
      'music',
      'film',
      'tv',
      'theater',
      'comedy',
      'acting',
      'production',
      'media',
      'broadcasting',
      'streaming',
    ],
    'Fashion & Design': [
      'fashion',
      'design',
      'styling',
      'textile',
      'apparel',
      'jewelry',
      'accessories',
      'graphic',
      'interior',
      'product design',
      'ux',
      'ui',
    ],
    Hospitality: [
      'hospitality',
      'hotel',
      'restaurant',
      'culinary',
      'chef',
      'food',
      'beverage',
      'tourism',
      'travel',
      'catering',
      'service',
    ],
    'Sports & Wellness': [
      'sports',
      'fitness',
      'wellness',
      'health',
      'nutrition',
      'training',
      'coaching',
      'athletic',
      'gym',
      'yoga',
      'therapy',
      'medical',
    ],
  };

  // Function to categorize items
  const categorizeItems = (items: any[]) => {
    const categorized: { [key: string]: any[] } = {
      Business: [],
      Entertainment: [],
      'Fashion & Design': [],
      Hospitality: [],
      'Sports & Wellness': [],
    };

    // Filter items based on search text
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    filteredItems.forEach(item => {
      const itemName = item.name.toLowerCase();
      let categorized_item = false;

      // Check which category this item belongs to
      Object.entries(categories).forEach(([categoryName, keywords]) => {
        if (
          !categorized_item &&
          keywords.some(keyword => itemName.includes(keyword))
        ) {
          categorized[categoryName].push(item);
          categorized_item = true;
        }
      });

      // If no category found, add to Business as default
      if (!categorized_item) {
        categorized.Business.push(item);
      }
    });

    return categorized;
  };

  const categorizedItems = categorizeItems(creativeFocus || []);

  // Check if there are any results
  const hasResults = Object.values(categorizedItems).some(items => items.length > 0);

  const handleCategorySelect = (category: any) => {
    console.log(selectedCategories.length);
    if (selectedCategories.find(item => item.id === category.id)) {
      console.log(category);
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
      console.log(category);
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

  const renderCollapsibleHeader = (categoryName: string, itemCount: number) => {
    const isExpanded = expandedSections[categoryName];
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
            <Text style={styles.arrowIcon}>{isExpanded ? '▲' : '▼'}</Text>
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
      console.log('Selected Categories:', selectedCategories);
      dispatch(setCreativeFocus(selectedCategories));
      dispatch(setPageProgress(7));
      navigation.navigate('SelectInterestScreen');
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
            Object.entries(categorizedItems).map(([categoryName, items]) => {
              // Only show categories that have items
              if (items.length === 0) {
                return null;
              }

              return (
                <CustomCollapsibleView
                  key={categoryName}
                  title={renderCollapsibleHeader(categoryName, items.length)}
                  isExpanded={expandedSections[categoryName]}
                  styles={styles}>
                  {renderCategoryItems(items)}
                </CustomCollapsibleView>
              );
            })
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
