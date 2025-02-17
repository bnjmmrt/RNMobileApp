import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useRef} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import GradientSeprator from 'src/component/GradientSeprator';
import {useLazyFetchUserFiltersQuery} from 'src/redux/actions/usersApiAction';
import {RootState} from 'src/redux/slices';
import {horizontalMarginScale, Hp} from 'src/utils/dimensions';
import {SelectedFilters} from '.';
import FilterAccordian from './FilterAccordian';
import FilterOptions, {FilterOption, FilterOptionTypes} from './FilterOptions';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import {InteractionManager} from 'react-native';

type FilterType = {
  id: string;
  isSearchable: true;
  label: string;
  options: FilterOption[];
  type: FilterOptionTypes;
};

const allowedFilters = [
  'list',
  'pastEvents',
  'category',
  'basecity',
  'gender',
  'age',
  'interest',
];
//followers is out of scope for now

const AllUsersFilters = ({
  selectedFilters,
  setSelectedFilters,
  setDisableApplyCta,
}: {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  setDisableApplyCta: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const filtersListRef = useRef<BottomSheetFlatListMethods>(null);
  const loginData = useSelector(
    (state: RootState) => state.auth.loginData,
    shallowEqual,
  );

  const [fetchFilters, {data, isLoading, error}] =
    useLazyFetchUserFiltersQuery();

  const filterData: FilterType[] =
    data?.data?.filter((item: FilterType) =>
      allowedFilters.includes(item.id),
    ) || [];

  const onChangeFilterOptionValue = (
    id: string,
    optionType: FilterOptionTypes,
    value: {id: string; name: string},
  ) => {
    let tempSelectedFilter = {...selectedFilters};

    if (optionType === 'checkbox') {
      if (tempSelectedFilter[id]) {
        let existingValues = tempSelectedFilter[id].value;

        if (existingValues?.some(innerItem => innerItem.id === value.id)) {
          existingValues = existingValues.filter(item => item.id !== value.id);
        } else {
          existingValues.push(value);
        }
        tempSelectedFilter[id] = {
          type: optionType,
          value: existingValues,
        };
      } else {
        tempSelectedFilter[id] = {
          type: optionType,
          value: [value],
        };
      }
    } else if (optionType === 'baseCityFilter') {
      if (tempSelectedFilter[id]) {
        let existingValues = tempSelectedFilter[id].value;
        if (existingValues?.some(innerItem => innerItem.id === value.id)) {
          existingValues = existingValues.filter(item => item.id !== value.id);
        } else {
          existingValues.push(value);
        }

        tempSelectedFilter[id] = {
          type: optionType,
          value: existingValues,
        };
      } else {
        tempSelectedFilter[id] = {
          type: optionType,
          value: [value],
        };
      }
    } else if (optionType === 'age') {
      tempSelectedFilter[id] = {
        type: optionType,
        value: [value],
      };
    }
    setSelectedFilters(tempSelectedFilter);
  };

  const renderItem = useCallback(
    ({item, index}: {item: FilterType; index: number}) => {
      const scrollToOpenedAccordian = (index: number) => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            filtersListRef?.current?.scrollToIndex({
              index: index,
              animated: true,
              viewPosition: 0,
            });
          }, 500);
        });
      };
      if (item.type === 'checkbox' && item.options.length === 0) return null;
      return (
        <FilterAccordian
          title={item?.label}
          onOpen={() => scrollToOpenedAccordian(index)}
          defaultOpen={index === 0}>
          <FilterOptions
            id={item.id}
            optionType={item.type}
            options={item.options}
            selectedFilters={selectedFilters}
            onChangeOptionValue={onChangeFilterOptionValue}
            setDisableApplyCta={setDisableApplyCta}
          />
        </FilterAccordian>
      );
    },
    [selectedFilters, setDisableApplyCta],
  );

  const itemSeparatorComponent = useCallback(() => {
    return <GradientSeprator />;
  }, []);

  useEffect(() => {
    if (loginData && loginData.id) {
      fetchFilters({id: loginData?.id});
    }
  }, [loginData]);

  return (
    <BottomSheetFlatList
      ref={filtersListRef}
      data={filterData}
      renderItem={renderItem}
      keyExtractor={(item, index) => `filters_header_${index.toString()}`}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={itemSeparatorComponent}
      contentContainerStyle={{marginHorizontal: horizontalMarginScale(12)}}
      style={{flex: 1}}
      ListEmptyComponent={
        <BottomSheetView
          style={{
            height: Hp(55),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <EventEmptyRecord title="" subTitle="" isLoading={isLoading} />
        </BottomSheetView>
      }
    />
  );
};

export default AllUsersFilters;
