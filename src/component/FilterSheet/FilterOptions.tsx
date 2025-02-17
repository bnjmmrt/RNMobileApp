import {BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef, useState} from 'react';
import Chip from 'src/component/Chip';
import GooglePlacesInput from 'src/component/GooglePlacesInput/GooglePlacesInput';
import Input, {InputRefMethods} from 'src/component/Input/Input';
import {
  fontScale,
  horizontalMarginScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {SelectedFilters} from '.';
import {styles} from './style';
import DateTimePicker from 'react-native-ui-datepicker';
import {Image, TouchableOpacity} from 'react-native';
import IMAGES from '@images/index';
import {CustomText} from '../CustomText';
import dayjs from 'dayjs';
import {COLORS} from 'src/utils/constants';
import {fontFamily} from 'src/utils/functions';

export type FilterOptionTypes =
  | 'checkbox'
  | 'age'
  | 'baseCityFilter'
  | 'location'
  | 'partySize'
  | 'dateRange';

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
  setDisableApplyCta,
  showSelectedLocationChip = true,
}: {
  id: string;
  optionType: FilterOptionTypes;
  options: FilterOption[];
  selectedFilters: SelectedFilters;
  onChangeOptionValue: (
    id: string,
    optionType: FilterOptionTypes,
    value: {id: string; name: string} | string[],
  ) => void;
  setDisableApplyCta: React.Dispatch<React.SetStateAction<boolean>>;
  showSelectedLocationChip: boolean;
}) => {
  const minAgeInputRef = useRef<InputRefMethods>(null);
  const maxAgeInputRef = useRef<InputRefMethods>(null);

  const [minAge, setMinAge] = useState<string>('');
  const [maxAge, setMaxAge] = useState<string>('');

  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    if (minAge && parseInt(minAge) < 18) {
      minAgeInputRef?.current?.setErrorMessage(
        'Minimum age must be 18 or older',
      );
      setDisableApplyCta(true);
    } else {
      minAgeInputRef?.current?.setErrorMessage('');
      setDisableApplyCta(false);
    }

    if (maxAge) {
      if (minAge && parseInt(maxAge) < parseInt(minAge)) {
        maxAgeInputRef?.current?.setErrorMessage(
          'Minimum age must be greater than or equal to "From" age',
        );
        setDisableApplyCta(true);
      } else {
        maxAgeInputRef?.current?.setErrorMessage('');
        setDisableApplyCta(false);
      }
    }
  }, [minAge, maxAge, setDisableApplyCta]);

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

      {optionType === 'dateRange' ? (
        <BottomSheetView style={styles.container}>
          <TouchableOpacity
            style={[styles.inputWrapper]}
            onPress={() => setDatePickerVisible(prev => !prev)}>
            <Image
              source={IMAGES.calendar}
              style={styles.icon}
              resizeMode="contain"
            />
            <BottomSheetView style={styles.inputValueWithLabel}>
              <CustomText>{`${dayjs(
                selectedFilters['minStartDate']?.value[0]
                  ? selectedFilters['minStartDate']?.value[0]?.id
                  : undefined,
              ).format('MM/DD/YY')} - ${dayjs(
                selectedFilters['maxEndDate']?.value[0]
                  ? selectedFilters['maxEndDate']?.value[0]?.id
                  : undefined,
              ).format('MM/DD/YY')}`}</CustomText>
              <Image
                source={IMAGES.downArrow}
                style={styles.icon}
                resizeMode="contain"
              />
            </BottomSheetView>
          </TouchableOpacity>

          {alert && (
            <CustomText style={styles.alert}>
              Please choose an End Date.
            </CustomText>
          )}

          {datePickerVisible && (
            <BottomSheetView style={styles.datePicker}>
              <DateTimePicker
                mode="range"
                startDate={
                  selectedFilters['minStartDate']?.value[0]
                    ? selectedFilters['minStartDate']?.value[0]?.id
                    : undefined
                }
                endDate={
                  selectedFilters['maxEndDate']?.value[0]
                    ? selectedFilters['maxEndDate']?.value[0]?.id
                    : undefined
                }
                headerButtonStyle={styles.headerButtonStyle}
                headerContainerStyle={{marginTop: 16}}
                headerTextStyle={{
                  fontFamily: fontFamily.ABCDiatype_Regular,
                  fontSize: fontScale(14),
                }}
                weekDaysTextStyle={{
                  fontFamily: fontFamily.ABCDiatype_Bold,
                  fontSize: fontScale(14),
                }}
                calendarTextStyle={{
                  fontFamily: fontFamily.ABCDiatype_Regular,
                  fontSize: fontScale(14),
                }}
                selectedItemColor={COLORS.black}
                selectedRangeBackgroundColor="lightgray"
                dayContainerStyle={styles.dayContainerStyle}
                buttonNextIcon={<Image source={IMAGES.arrowRight} />}
                buttonPrevIcon={
                  <Image
                    source={IMAGES.arrowRight}
                    style={{transform: [{rotate: '180deg'}]}}
                  />
                }
                onChange={({startDate, endDate}) => {
                  console.log(startDate, endDate);
                  if (startDate) {
                    onChangeOptionValue('minStartDate', optionType, {
                      id: startDate,
                      name: 'minStartDate',
                    });
                  }
                  if (endDate) {
                    onChangeOptionValue('maxEndDate', optionType, {
                      id: endDate,
                      name: 'maxEndDate',
                    });
                  }
                }}
              />
            </BottomSheetView>
          )}
        </BottomSheetView>
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

      {optionType === 'baseCityFilter' || optionType === 'location' ? (
        <BottomSheetView>
          <GooglePlacesInput
            submit={() => {}}
            setLocation={location => {
              onChangeOptionValue(id, optionType, {
                id: location.placeId,
                name: location.address,
                lat: location.latitude,
                long: location.longitude,
              });
            }}
          />
          {showSelectedLocationChip &&
          selectedFilters &&
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
