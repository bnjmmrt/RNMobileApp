import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, { useCallback, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { DateType } from 'react-native-ui-datepicker';
import GradientSeprator from 'src/component/GradientSeprator';
import { feedList } from 'src/utils/constants';
import { horizontalMarginScale } from 'src/utils/dimensions';
import { SelectedFilters } from '.';
import FilterAccordian from './FilterAccordian';
import FilterOptions, {
  FilterOption,
  FilterOptionTypes,
} from './FilterOptions';

type FilterType = {
  id: string;
  label: string;
  options: FilterOption[];
  type: FilterOptionTypes;
};

const DiscoverEventsFilters = ({
  selectedFilters,
  setSelectedFilters,
  setDisableApplyCta,
}: {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  setDisableApplyCta: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const filtersListRef = useRef<BottomSheetFlatListMethods>(null);

  const onChangeFilterOptionValue = (
    id: string,
    optionType: FilterOptionTypes,
    value: {
      id: string;
      name: string;
      date?: DateType[];
      lat?: string;
      long?: string;
    },
  ) => {
    let tempSelectedFilter = { ...selectedFilters };

    if (optionType === 'checkbox') {
      if (tempSelectedFilter[id]) {
        if (
          typeof value === 'object' &&
          !Array.isArray(value) &&
          'id' in value
        ) {
          let existingValues = tempSelectedFilter[id].value;

          if (existingValues?.some(innerItem => innerItem.id === value.id)) {
            existingValues = existingValues.filter(
              item => item.id !== value.id,
            );
          } else {
            existingValues.push(value);
          }
          tempSelectedFilter[id] = {
            type: optionType,
            value: existingValues,
          };
        }
      } else {
        if (
          typeof value === 'object' &&
          !Array.isArray(value) &&
          'id' in value
        ) {
          tempSelectedFilter[id] = {
            type: optionType,
            value: [value],
          };
        }
      }
    } else if (optionType === 'location') {
      if (typeof value === 'object' && !Array.isArray(value) && 'id' in value) {
        if (value.long) {
          tempSelectedFilter['longitude'] = {
            type: optionType,
            value: [{ id: value.long, name: value.name }],
          };
        }
        if (value.lat) {
          tempSelectedFilter['latitude'] = {
            type: optionType,
            value: [{ id: value.lat, name: '' }],
          };
        }
      }
    } else if (optionType === 'dateRange') {
      const startDate = value?.date[0];
      const endDate = value?.date[1];

      if (startDate) {
        const formattedMinStartDate = moment
          .utc(new Date(startDate))
          .format('YYYY-MM-DDTHH:mm:ss[Z]');

        tempSelectedFilter['minStartDate'] = {
          type: 'minStartDate',
          value: [
            {
              id: formattedMinStartDate,
              date: startDate,
              name:
                moment(new Date(startDate)).format('MMM DD, YYYY') +
                (endDate
                  ? ' - ' + moment(new Date(endDate)).format('MMM DD, YYYY')
                  : ''),
            },
          ],
        };
      }

      let formattedMaxEndDate = endDate;
      if (endDate) {
        formattedMaxEndDate = moment
          .utc(new Date(endDate as Date))
          .format('YYYY-MM-DDTHH:mm:ss[Z]');

        setDisableApplyCta(false);
      } else {
        setDisableApplyCta(true);
      }
      tempSelectedFilter['maxEndDate'] = {
        type: 'maxEndDate',
        value: [
          {
            id: formattedMaxEndDate,
            date: endDate,
            name: '',
          },
        ],
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
            showSelectedLocationChip={false}
            onOpenNestedAccordian={() => scrollToOpenedAccordian(index)}
          />
        </FilterAccordian>
      );
    },
    [selectedFilters, setDisableApplyCta],
  );

  const itemSeparatorComponent = useCallback(() => {
    return <GradientSeprator />;
  }, []);

  const categories: FilterOption[] = feedList.map((item: string) => {
    return { id: item, name: item } as FilterOption;
  });

  const filterData: FilterType[] = [
    {
      id: 'eventTypeName',
      label: 'Categories',
      options: categories,
      type: 'checkbox',
    },
    {
      id: 'location',
      label: 'Location',
      options: [],
      type: 'location',
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      options: [],
      type: 'dateRange',
    },
  ];

  return (
    <BottomSheetFlatList
      ref={filtersListRef}
      data={filterData || []}
      renderItem={renderItem}
      keyExtractor={(item, index) => `filters_header_${index.toString()}`}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={itemSeparatorComponent}
      contentContainerStyle={{ marginHorizontal: horizontalMarginScale(12) }}
      keyboardShouldPersistTaps="always"
    />
  );
};

export default DiscoverEventsFilters;
