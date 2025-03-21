import React = require('react');
import { styles } from './styles';
import { CustomText } from 'src/component/CustomText';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import IMAGES from '@images/index';
import { COLORS } from 'src/utils/constants';
import { useSelector } from 'react-redux';
import { useDeclineApplicationMutation } from 'src/redux/actions/rspvApiAction';
import { RootState } from 'src/redux/slices';
import { ActivityIndicator } from 'react-native';
const reasons = [
  { id: 1, name: 'Scheduling Conflict' },
  { id: 2, name: 'Prior Commitment' },
  { id: 3, name: 'Traveling' },
  { id: 4, name: 'Event Location Inconvenient' },
  { id: 5, name: 'Not Interested in This Event' },
  { id: 6, name: 'Too Short of Notice' },
  { id: 7, name: 'Weather Concerns' },
  { id: 8, name: 'Other' },
];
const RenderCancelPopup = ({
  reasonSelected,
  setReasonSelected,
  id,
  onClose,
}) => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [
    declineApplication,
    { isLoading: declineLoading, isError: declineError },
  ] = useDeclineApplicationMutation();

  const onCancelRSPV = () => {
    handleDecline();
  };
  const handleDecline = async () => {
    try {
      const response = await declineApplication({
        id: userId,
        eventId: id,
        reason: reasonSelected.name,
        guestId: '',
      });

      if (response?.data) {
        onClose();
        console.log('Application declined successfully:', response.data);
      } else {
        console.warn('Failed to decline the application.');
      }
    } catch (error) {
      console.error('Error declining the application:', error);
    }
  };
  return (
    <View style={styles.cancelPopupContainer}>
      <CustomText style={styles.eventTitle}>Cancel your RSVP?</CustomText>
      <CustomText style={styles.descText}>
        This action cannot be undone. If you cancel, your guests will be
        notified, and their passes will be revoked. To rejoin later, you’ll need
        to request a new invite from the host. Please let us know why you can’t
        make it.
      </CustomText>
      {reasons.map(item => {
        return (
          <TouchableOpacity
            key={item.id.toString()}
            style={[
              styles.guestButton,
              reasonSelected === item && {
                borderWidth: 2,
                borderColor: COLORS.black,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
              },
            ]}
            onPress={() => setReasonSelected(item)}>
            {reasonSelected == item && (
              <Image source={IMAGES.check} style={{ width: 16, height: 16 }} />
            )}
            <Text style={styles.guestButtonText}>{item.name}</Text>
            {reasonSelected == item && <View />}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={onCancelRSPV}
        disabled={declineLoading}
        style={styles.redButton}>
        {declineLoading ? (
          <ActivityIndicator color={COLORS.black} />
        ) : (
          <Text style={[styles.optionText, { color: COLORS.white }]}>
            Cancel RSVP
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
export default RenderCancelPopup;
