import {BottomSheetFlatList, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import GradientSeprator from 'src/component/GradientSeprator';
import {useLazyFetchUserFiltersQuery} from 'src/redux/actions/usersApiAction';
import {RootState} from 'src/redux/slices';
import {horizontalMarginScale} from 'src/utils/dimensions';
import {SelectedFilters} from '.';
import FilterAccordian from './FilterAccordian';
import FilterOptions, {FilterOption, FilterOptionTypes} from './FilterOptions';

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
}: {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
}) => {
  const loginData = useSelector(
    (state: RootState) => state.auth.loginData,
    shallowEqual,
  );

  const [fetchFilters, {data, isLoading, error}] =
    useLazyFetchUserFiltersQuery();

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
    ({item}: {item: FilterType}) => {
      if (item.type === 'checkbox' && item.options.length === 0) return null;
      return (
        <FilterAccordian title={item?.label}>
          <FilterOptions
            id={item.id}
            optionType={item.type}
            options={item.options}
            selectedFilters={selectedFilters}
            onChangeOptionValue={onChangeFilterOptionValue}
          />
        </FilterAccordian>
      );
    },
    [selectedFilters],
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
    <BottomSheetScrollView>
      <BottomSheetFlatList
        data={
          data?.data?.filter((item: FilterOption) =>
            allowedFilters.includes(item.id),
          ) || []
        }
        renderItem={renderItem}
        keyExtractor={(item, index) => `filters_header_${index.toString()}`}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={itemSeparatorComponent}
        contentContainerStyle={{marginHorizontal: horizontalMarginScale(12)}}
      />
    </BottomSheetScrollView>
  );
};

export default AllUsersFilters;
