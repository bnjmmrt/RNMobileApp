import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import { SelectedSingleFilter } from 'src/component/FilterSheet';
import GooglePlacesInput from 'src/component/GooglePlacesInput/GooglePlacesInput';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import Title from '../../../component/Title/Title';
import { RootState } from '../../../redux/slices';
import {
  Address,
  setBaseCity,
  setPageProgress,
} from '../../../redux/slices/appFlowSlice';
import { BUTTON_LABLE, ERROR_MESSAGE, LABLE } from '../../../utils/constants';
import BaseCityScreenStyles from './BaseCityScreenStyles';
import useKeyboard from 'src/utils/hooks/useKeyboard';

export type SelectedFilters = {
  [id: string]: SelectedSingleFilter;
};
interface BaseCityScreenProps extends NativeStackScreenProps<any, any> {}

const BaseCityScreen: React.FC<BaseCityScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { keyboardVisible } = useKeyboard();
  const baseCity = useSelector((state: RootState) => state.appFlow.baseCity);
  const [selectedCity, setSelectedCity] = useState<Address>(baseCity);

  const styles = BaseCityScreenStyles();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onNextClick = () => {
    if (validateInputs()) {
      dispatch(setBaseCity(selectedCity));
      dispatch(setPageProgress(6));
      navigation.navigate('CreativeFocusScreen');
    }
  };
  // Validate inputs
  const validateInputs = () => {
    if (!selectedCity.address) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BASE_CITY);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(4));
    navigation.goBack();
  };

  const onChangeLocationValue = (location: any) => {
    console.log('setSelectedFiltered', location);
    setSelectedCity(location);
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header headerTitle={LABLE.BASE_CITY} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHERE_DO_YOU_CALL_HOME}
          subTitle={LABLE.WE_WILL_RECOMMEND_EVENTS_AND_EXPERIENCES_NEAR_YOU}
        />
        <View style={{ height: 15 }} />
        {/* <TouchableOpacity onPress={openLocationPicker}>
          <CustomSelectableText
            placeholder={LABLE.SEARCH_FOR_A_LOCATION}
            leftImage={IMAGES.search}
            errorMessage={errorMessage}
            defaultValue={selectedCity.address}
            onPress={openLocationPicker}
          />
        </TouchableOpacity>

        {isShown && (
          <LocationPickerModal
            setLocation={setSelectedCity}
            setIsShown={setIsShown}
          />
        )} */}

        <GooglePlacesInput
          defaultValue={selectedCity.address}
          errorMessage={errorMessage}
          setError={setErrorMessage}
          submit={() => {}}
          setLocation={location => {
            onChangeLocationValue({
              placeId: location.placeId,
              address: location.address,
              lat: location.latitude,
              long: location.longitude,
            });
          }}
        />

        {/* {errorMessage ? (
          <Text style={[styles.errorText]}>{errorMessage}</Text>
        ) : null} */}
        {/* {showSelectedLocationChip && (
            // <BottomSheetScrollView
            //   contentContainerStyle={{
            //     gap: horizontalMarginScale(4),
            //     flexDirection: 'row',
            //     flexWrap: 'wrap',
            //   }}
            //   style={{marginTop: verticalMarginScale(16)}}
            //   scrollEnabled={false}>
            //   {selectedFilters[id].value.map(
            //     (
            //       item: {
            //         id: string | DateType;
            //         name: string;
            //         lat?: string;
            //         long?: string;
            //       },
            //       index: number,
            //     ) => {
            //       return (
            //         <Chip
            //           title={item.name}
            //           isSelected={
            //             selectedFilters
            //               ? selectedFilters[id]?.value?.includes(item)
            //               : false || false
            //           }
            //           onPress={optionId => {
            //             onChangeFilterOptionValue({
            //               id: String(item.id),
            //               name: item.name,
            //             })
            //           }}
            //           id={String(item.id)}
            //         />
            //       );
            //     },
            //   )}
            // </BottomSheetScrollView>
          )} */}
      </View>
      {!keyboardVisible ? (
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.NEXT}
          colorTheme="dark"
          onPress={onNextClick}
        />
      ) : null}
    </View>
  );
};

export default BaseCityScreen;
