import React from 'react';
import {Modal, View, StyleSheet, Text, Image} from 'react-native';
import {format} from 'date-fns';
import Button from '../Button';
import IMAGES from '../../assets/images';
import {EventItem} from './EventsFeed';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../../utils/dimensions';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';

interface FeedDetailProps {
  detail: EventItem | null;
  setDetail: React.Dispatch<React.SetStateAction<EventItem | null>>;
  handleNotify: () => void;
}

const FeedDetail: React.FC<FeedDetailProps> = ({
  detail,
  setDetail,
  handleNotify,
}) => {
  const formatDate = (dateString: string) => {
    console.log(dateString);
    return format(
      new Date(
        `${dateString.slice(6, 10)}-${dateString.slice(
          0,
          2,
        )}-${dateString.slice(3, 5)}`,
      ),
      'MMM d yyyy',
    );
  };

  const handleYes = () => {
    handleNotify();
    setDetail(null);
  };

  if (!detail) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={!!detail}
      onRequestClose={() => setDetail(null)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalBar} />
          <Image
            source={
              detail.image
                ? {uri: detail.image}
                : IMAGES.eventCoverPlaceholders1
            }
            style={styles.image}
          />
          <Text style={styles.title}>{detail.title}</Text>
          <Text style={styles.dateText}>
            {formatDate(detail.startDate)} - {formatDate(detail.endDate)}
          </Text>
          <Text style={styles.messageText}>Message</Text>
          <View style={styles.buttonContainer}>
            <Button
              disabled={false}
              style={styles.clearFilters}
              title="No"
              onPress={() => setDetail(null)}
            />
            <Button
              disabled={false}
              style={styles.showResults}
              title="Yes"
              colorTheme="dark"
              onPress={handleYes}
            />
          </View>
          <Text style={styles.infoText}>
            Your response is shown to hosts and boosts your chances of receiving
            relevant event invites.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayMiddle,
  },
  modalContent: {
    width: Wp(100),
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(25),
    paddingVertical: verticalMarginScale(20),
    top: '10%',
    height: Hp(80),
  },
  modalBar: {
    width: horizontalScale(48),
    height: verticalScale(4),
    borderRadius: radiusScale(50),
    backgroundColor: COLORS.tabBorderColor,
    alignSelf: 'center',
    marginBottom: verticalMarginScale(12),
  },
  title: {
    fontSize: fontScale(24),
    color: COLORS.black,
    fontFamily: fontFamily.RomieTrial_Bold,
    lineHeight: 32,
    textAlign: 'center',
    paddingTop: verticalMarginScale(36),
  },
  dateText: {
    paddingVertical: verticalMarginScale(6),
    textAlign: 'center',
  },
  messageText: {
    paddingVertical: verticalMarginScale(6),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalMarginScale(12),
    gap: 8,
  },
  infoText: {
    textAlign: 'center',
    fontSize: fontScale(12),
    paddingHorizontal: horizontalMarginScale(18),
    paddingTop: verticalMarginScale(8),
  },
  image: {
    width: Wp(96),
    height: Hp(40),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
    objectFit: 'contain',
    alignSelf: 'center',
  },
  showResults: {
    width: Wp(45),
    borderRadius: radiusScale(100),
  },
  clearFilters: {
    width: Wp(45),
    borderColor: COLORS.black,
    borderWidth: 2,
    borderRadius: radiusScale(100),
  },
});

export default FeedDetail;
