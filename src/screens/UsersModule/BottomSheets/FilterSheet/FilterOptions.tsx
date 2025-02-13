import {BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef, useState} from 'react';
import Chip from 'src/component/Chip';
import GooglePlacesInput from 'src/component/GooglePlacesInput/GooglePlacesInput';
import Input, {InputRefMethods} from 'src/component/Input/Input';
import {
  horizontalMarginScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {styles} from './style';
import {SelectedFilters} from '.';

export type FilterOptionTypes =
  | 'checkbox'
  | 'age'
  | 'baseCityFilter'
  | 'partySize';

export type FilterOption = {
  id: string;
  name: string;
  options: FilterOption[];
};

const FilterOptions = ({
  id,
  optionType,
  options,
  selectedFilters,
  onChangeOptionValue,
}: {
  id: string;
  optionType: FilterOptionTypes;
  options: FilterOption[];
  selectedFilters: SelectedFilters;
  onChangeOptionValue: (
    id: string,
    optionType: FilterOptionTypes,
    value: {id: string; name: string},
  ) => void;
}) => {
  const minAgeInputRef = useRef<InputRefMethods>(null);
  const maxAgeInputRef = useRef<InputRefMethods>(null);

  const [minAge, setMinAge] = useState<string>('');
  const [maxAge, setMaxAge] = useState<string>('');

  useEffect(() => {
    if (minAge && parseInt(minAge) < 18) {
      minAgeInputRef?.current?.setErrorMessage(
        'Minimum age must be 18 or older',
      );
    } else {
      minAgeInputRef?.current?.setErrorMessage('');
    }

    if (maxAge && minAge && parseInt(maxAge) < parseInt(minAge)) {
      maxAgeInputRef?.current?.setErrorMessage(
        'Minimum age must be greater than or equal to "From" age',
      );
    } else {
      maxAgeInputRef?.current?.setErrorMessage('');
    }
  }, [minAge, maxAge]);

  return (
    <BottomSheetView>
      {optionType === 'checkbox' ? (
        <BottomSheetScrollView
          contentContainerStyle={{
            gap: horizontalMarginScale(4),
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
          scrollEnabled={false}>
          {options.map((item: FilterOption, index: number) => {
            return (
              <Chip
                title={item.name}
                isSelected={
                  selectedFilters
                    ? selectedFilters[id]?.value?.some(
                        innerItem => innerItem.id === item.id,
                      )
                    : false || false
                }
                onPress={optionId => {
                  onChangeOptionValue(id, optionType, {
                    id: optionId,
                    name: item.name,
                  });
                }}
                id={item.id}
              />
            );
          })}
        </BottomSheetScrollView>
      ) : null}
      {optionType === 'age' ? (
        <BottomSheetView style={styles.optionAgeContainer}>
          <Input
            ref={minAgeInputRef}
            defaultValue={minAge}
            placeholder=""
            label="From"
            errorMessage=""
            forBottomSheet={true}
            otherStyle={{flex: 1, marginTop: 0}}
            inputFieldContainerStyle={{height: verticalScale(40)}}
            onChangeText={text => {
              setMinAge(text);
              onChangeOptionValue(id, optionType, {id: text, name: text});
            }}
            keyboardType="number-pad"
          />
          <Input
            ref={maxAgeInputRef}
            defaultValue={maxAge}
            placeholder=""
            label="To"
            errorMessage="Minimum age must be greater than or equal to 'From' age"
            forBottomSheet={true}
            otherStyle={{flex: 1, marginTop: 0}}
            inputFieldContainerStyle={{height: verticalScale(40)}}
            onChangeText={text => {
              setMaxAge(text);
              onChangeOptionValue(id, optionType, {id: text, name: text});
            }}
            keyboardType="number-pad"
          />
        </BottomSheetView>
      ) : null}
      {optionType === 'baseCityFilter' ? (
        <BottomSheetView>
          <GooglePlacesInput
            submit={() => {}}
            setLocation={location => {
              onChangeOptionValue(id, optionType, {
                id: location.placeId,
                name: location.address,
              });
            }}
          />
          {selectedFilters &&
          selectedFilters[id] &&
          selectedFilters[id].value ? (
            <BottomSheetScrollView
              contentContainerStyle={{
                gap: horizontalMarginScale(4),
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              style={{marginTop: verticalMarginScale(16)}}
              scrollEnabled={false}>
              {selectedFilters[id].value.map(
                (item: {id: string; name: string}, index: number) => {
                  return (
                    <Chip
                      title={item.name}
                      isSelected={
                        selectedFilters
                          ? selectedFilters[id]?.value?.includes(item)
                          : false || false
                      }
                      onPress={optionId => {
                        onChangeOptionValue(id, optionType, {
                          id: item.id,
                          name: item.name,
                        });
                      }}
                      id={item.id}
                    />
                  );
                },
              )}
            </BottomSheetScrollView>
          ) : null}
        </BottomSheetView>
      ) : null}
    </BottomSheetView>
  );
};

export default FilterOptions;
