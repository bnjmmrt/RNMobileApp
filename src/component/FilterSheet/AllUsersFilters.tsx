import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { DateType } from 'react-native-ui-datepicker';
import { shallowEqual, useSelector } from 'react-redux';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import GradientSeprator from 'src/component/GradientSeprator';
import { useLazyFetchUserFiltersQuery } from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { horizontalMarginScale, Hp } from 'src/utils/dimensions';
import { FilterSheetFromType, SelectedFilters } from '.';
import FilterAccordian from './FilterAccordian';
import FilterOptions, {
  FilterOption,
  FilterOptionTypes,
} from './FilterOptions';

type FilterType = {
  id: string;
  isSearchable: true;
  label: string;
  options: FilterOption[];
  type: FilterOptionTypes;
};

const basicUserAllowedFilters = [
  'pastEvents',
  'category',
  'basecity',
  'gender',
  'age',
  'interest',
];
const allUsersAllowedFilters = ['list', ...basicUserAllowedFilters];
const listDetailsAllowedFilters = basicUserAllowedFilters;
//followers is out of scope for now

const AllUsersFilters = ({
  selectedFilters,
  setSelectedFilters,
  setDisableApplyCta,
  from,
}: {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  setDisableApplyCta: React.Dispatch<React.SetStateAction<boolean>>;
  from: FilterSheetFromType;
}) => {
  const filtersListRef = useRef<BottomSheetFlatListMethods>(null);
  const userId = useSelector(
    (state: RootState) => state.auth.userId,
    shallowEqual,
  );

  const [fetchFilters, { data, isLoading, error }] =
    useLazyFetchUserFiltersQuery();

  const allowedFilters =
    from === 'allUsersList'
      ? allUsersAllowedFilters
      : listDetailsAllowedFilters;

  const filterData: FilterType[] =
    data?.data?.filter(
      (item: FilterType) =>
        allowedFilters.includes(item.id) &&
        (item.type !== 'checkbox' ||
          (item.type === 'checkbox' && item.options.length > 0)),
    ) || [];

  const onChangeFilterOptionValue = (
    id: string,
    optionType: FilterOptionTypes,
    value: { id: string | DateType; name: string },
  ) => {
    let tempSelectedFilter = { ...selectedFilters };

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
    ({ item, index }: { item: FilterType; index: number }) => {
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
    if (userId) {
      fetchFilters({ id: userId });
    }
  }, [userId]);

  return (
    <BottomSheetFlatList
      ref={filtersListRef}
      data={filterData}
      renderItem={renderItem}
      keyExtractor={(item, index) => `filters_header_${index.toString()}`}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={itemSeparatorComponent}
      contentContainerStyle={{ marginHorizontal: horizontalMarginScale(12) }}
      style={{ flex: 1 }}
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
