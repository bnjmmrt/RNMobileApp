import React from 'react';
import {Modal, View, StyleSheet, Text, Image} from 'react-native';
import {COLORS} from '../../utils/constants';
import {Hp, Wp} from '../../utils/dimensions';
import Button from '../Button';
import {fontFamily} from '../../utils/functions';
import {EventItem} from './EventsFeed';
import IMAGES from '../../assets/images';

interface FeedDetailProps {
  detail: EventItem | null;
  setDetail: React.Dispatch<React.SetStateAction<EventItem | null>>;
}

const FeedDetail: React.FC<FeedDetailProps> = ({detail, setDetail}) => {
  if (!detail) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
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
            {detail.startDate} - {detail.endDate}
          </Text>
          <Text style={styles.messageText}>Message</Text>

          <View style={styles.buttonContainer}>
            <Button
              disabled={false}
              style={styles.clearFilters}
              title="No"
              onPress={() => {}}
            />
            <Button
              disabled={false}
              style={styles.showResults}
              title="Yes"
              colorTheme="dark"
              onPress={() => {}}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 20,
    top: '10%',
    height: '80%',
  },
  modalBar: {
    width: 48,
    height: 4,
    borderRadius: 50,
    backgroundColor: '#D8D8D8',
    top: -12,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontFamily: 'Times New Roman',
    fontWeight: '700',
    lineHeight: 32,
    textAlign: 'center',
    paddingTop: 36,
  },
  dateText: {
    paddingVertical: 6,
    textAlign: 'center',
  },
  messageText: {
    paddingVertical: 6,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  image: {
    width: Wp(96),
    height: Hp(40),
    borderRadius: 16,
    alignSelf: 'center',
  },
  showResults: {
    width: Wp(45),
    borderRadius: 100,
  },
  clearFilters: {
    width: Wp(45),
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 100,
  },
});

export default FeedDetail;
