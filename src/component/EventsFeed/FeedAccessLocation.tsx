import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Hp, Wp} from '../../utils/dimensions';

interface FeedAccessLocationProps {
  setAllowAccess: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedAccessLocation: React.FC<FeedAccessLocationProps> = ({
  setFilterVisible,
  setAllowAccess,
}) => {
  return (
    <View style={styles.background}>
      <View style={styles.modal}>
        <View style={styles.section1}>
          <Text style={styles.title}>
            Allow "Rumor" to access your location
          </Text>
          <Text style={styles.content}>
            This app requires location tracking
          </Text>
        </View>

        <View style={styles.section2}>
          <TouchableOpacity
            onPress={() => {
              setAllowAccess(false);
              setFilterVisible(true);
            }}>
            <Text style={styles.onlyWhileUsing}>Only While using the App</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section3}>
          <TouchableOpacity
            onPress={() => {
              setAllowAccess(false);
              setFilterVisible(true);
            }}>
            <Text style={styles.alwaysAllow}>Always Allow</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section4}>
          <TouchableOpacity
            onPress={() => {
              setAllowAccess(false);
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
    backgroundColor: '#00000033',
  },
  modal: {
    width: 270,
    height: 232,
    borderRadius: 16,
    backgroundColor: '#E0E0E0FA',
  },
  section1: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  section2: {
    borderTopColor: '#54545657',
    borderTopWidth: 0.3,
    paddingVertical: 8,
  },
  section3: {
    borderTopColor: '#54545657',
    borderTopWidth: 0.3,
    paddingVertical: 8,
  },
  section4: {
    borderTopColor: '#54545657',
    borderTopWidth: 0.3,
    paddingVertical: 8,
  },
  title: {
    color: '#000000',
    fontFamily: 'SF Pro',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  content: {
    color: '#000000',
    fontFamily: 'SF Pro',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  onlyWhileUsing: {
    color: '#007AFF',
    fontFamily: 'SF Pro',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  alwaysAllow: {
    color: '#007AFF',
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  dontAllow: {
    color: '#007AFF',
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
});

export default FeedAccessLocation;
