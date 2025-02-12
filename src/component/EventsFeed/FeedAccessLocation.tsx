import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {storeData} from '../../utils/functions';
import {COLORS} from '../../utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
  horizontalScale,
  radiusScale,
  fontScale,
  Hp,
  Wp,
} from '../../utils/dimensions';

interface FeedAccessLocationProps {
  allowAccessModal: boolean;
  setAllowAccess: React.Dispatch<React.SetStateAction<boolean>>;
  setAllowAccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedAccessLocation: React.FC<FeedAccessLocationProps> = ({
  allowAccessModal,
  setAllowAccess,
  setAllowAccessModal,
  setFilterVisible,
}) => {
  if (!allowAccessModal) return null;

  return (
    <View style={styles.background}>
      <View style={styles.modal}>
        <View style={styles.section1}>
          <Text style={styles.title}>
            Allow ”Rumor” to access your location
          </Text>
          <Text style={styles.content}>
            This app requires location tracking
          </Text>
        </View>

        <View style={styles.section2}>
          <TouchableOpacity
            onPress={() => {
              setAllowAccess(true);
              setAllowAccessModal(false);
              setFilterVisible(true);
            }}>
            <Text style={styles.onlyWhileUsing}>Only While using the App</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section3}>
          <TouchableOpacity
            onPress={async () => {
              await storeData('allowAccess', 'true');
              setAllowAccess(true);
              setAllowAccessModal(false);
              setFilterVisible(true);
            }}>
            <Text style={styles.alwaysAllow}>Always Allow</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section4}>
          <TouchableOpacity
            onPress={() => {
              setAllowAccessModal(false);
            }}>
            <Text style={styles.dontAllow}>Don't Allow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: Wp(100),
    height: Hp(100),
    zIndex: 9999999,
    backgroundColor: COLORS.grayFeedLocation1,
  },
  modal: {
    width: horizontalScale(270),
    borderRadius: radiusScale(16),
    backgroundColor: COLORS.grayFeedLocation2,
  },
  section1: {
    paddingVertical: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(8),
  },
  section2: {
    borderTopColor: COLORS.grayFeedLocation3,
    borderTopWidth: 0.3,
    paddingVertical: verticalMarginScale(8),
  },
  section3: {
    borderTopColor: COLORS.grayFeedLocation3,
    borderTopWidth: 0.3,
    paddingVertical: verticalMarginScale(8),
  },
  section4: {
    borderTopColor: COLORS.grayFeedLocation3,
    borderTopWidth: 0.3,
    paddingTop: verticalMarginScale(8),
    paddingBottom: verticalMarginScale(12),
  },
  title: {
    color: COLORS.black,
    fontSize: fontScale(17),
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  content: {
    color: COLORS.black,
    fontSize: fontScale(12),
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  onlyWhileUsing: {
    color: COLORS.blueLocation,
    fontSize: fontScale(17),
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  alwaysAllow: {
    color: COLORS.blueLocation,
    fontSize: fontScale(17),
    fontWeight: '300',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  dontAllow: {
    color: COLORS.blueLocation,
    fontSize: fontScale(17),
    fontWeight: '300',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
});

export default FeedAccessLocation;
