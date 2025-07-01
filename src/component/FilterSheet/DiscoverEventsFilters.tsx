import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, { useCallback, useRef } from 'react';
import { InteractionManager, View } from 'react-native';
import { DateType } from 'react-native-ui-datepicker';
import GradientSeprator from 'src/component/GradientSeprator';
import { useFetchEventTypesQuery } from 'src/redux/actions/eventApiAction';
import {
  horizontalMarginScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import { SelectedFilters } from '.';
import FilterAccordian from './FilterAccordian';
import FilterOptions, {
  FilterOption,
  FilterOptionTypes,
} from './FilterOptions';
import { CustomText } from '../CustomText';
import { styles } from './style';

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
  snapToNewPoint,
}: {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  setDisableApplyCta: React.Dispatch<React.SetStateAction<boolean>>;
  snapToNewPoint?: (x: number | null) => void;
}) => {
  const filtersListRef = useRef<BottomSheetFlatListMethods>(null);

  const {
    data: eventTypes,
    isLoading,
    error,
    isError,
  } = useFetchEventTypesQuery({});

  const onChangeFilterOptionValue = (
    id: string,
    optionType: FilterOptionTypes,
    value: {
      id: string;
      name: string;
      date?: DateType | DateType[];
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
      if (tempSelectedFilter[id]) {
        if (
          typeof value === 'object' &&
          !Array.isArray(value) &&
          'id' in value
        ) {
          const tempExistingValue = tempSelectedFilter[id].value;
          const idIndex = tempExistingValue.findIndex(
            existinVal => existinVal?.id === value.id,
          );
          if (idIndex < 0) {
            tempExistingValue.push({
              id: value.id,
              name: value.name,
              lat: value.lat,
              long: value.long,
            });
          } else {
            tempExistingValue.splice(idIndex, 1);
          }
        }
      } else {
        tempSelectedFilter[id] = {
          type: optionType,
          value: [
            {
              id: value.id,
              name: value.name,
              lat: value.lat,
              long: value.long,
            },
          ],
        };
      }
      // if (typeof value === 'object' && !Array.isArray(value) && 'id' in value) {
      //   if (value.long) {
      //     tempSelectedFilter['longitude'] = {
      //       type: optionType,
      //       value: [{ id: value.long, name: value.name }],
      //     };
      //   }
      //   if (value.lat) {
      //     tempSelectedFilter['latitude'] = {
      //       type: optionType,
      //       value: [{ id: value.lat, name: '' }],
      //     };
      //   }
      // }
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
      return item.type === 'checkbox' ? (
        <>
          <FilterAccordian
            title={item?.label}
            onOpen={() => {
              scrollToOpenedAccordian(index);
              snapToNewPoint?.(88);
            }}
            onClose={() => {
              snapToNewPoint?.(null);
            }}>
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
          <GradientSeprator />
        </>
      ) : (
        <BottomSheetView
          style={[
            styles.accordianContainer,
            { paddingBottom: verticalMarginScale(16) },
          ]}>
          <View style={styles.accordianTitleContainer}>
            <CustomText style={styles.accordianTitle}>{item.label}</CustomText>
          </View>
          <FilterOptions
            id={item.id}
            optionType={item.type}
            options={item.options}
            selectedFilters={selectedFilters}
            onChangeOptionValue={onChangeFilterOptionValue}
            setDisableApplyCta={setDisableApplyCta}
            showSelectedLocationChip={item.type === 'location'}
            onOpenNestedAccordian={() => scrollToOpenedAccordian(index)}
          />
        </BottomSheetView>
      );
    },
    [selectedFilters, setDisableApplyCta],
  );

  const eventTpeData = eventTypes?.data?.items || [];
  const categories: FilterOption[] = eventTpeData?.map(
    (item: {
      id: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      name: string;
      description: string;
      enabled: boolean;
    }) => {
      return { id: item.id, name: item.name } as FilterOption;
    },
  );

  const filterData: FilterType[] = [
    {
      id: 'eventTypeId',
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
      contentContainerStyle={{ marginHorizontal: horizontalMarginScale(12) }}
      keyboardShouldPersistTaps="always"
    />
  );
};

export default DiscoverEventsFilters;
