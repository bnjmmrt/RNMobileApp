import React, {useState} from 'react';
import {View} from 'react-native';
import LocationPickerModal from '../BottomSheet/LocationPickerModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/slices';
import {Address} from '../../redux/slices/appFlowSlice';

interface FeedFilterProps {
  filterVisible: boolean;
  setFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedFilter: React.FC<FeedFilterProps> = ({
  filterVisible,
  setFilterVisible,
}) => {
  const baseCity = useSelector((state: RootState) => state.appFlow.baseCity);
  const [selectedCity, setSelectedCity] = useState<Address>(baseCity);

  return (
    <View style={{position: 'absolute', backgroundColor: '#000000BF'}}>
      {filterVisible && (
        <LocationPickerModal
          setLocation={setSelectedCity}
          setIsShown={setFilterVisible}
          submitVisible
        />
      )}
    </View>
  );
};

export default FeedFilter;
