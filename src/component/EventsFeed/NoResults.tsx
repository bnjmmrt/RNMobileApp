import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  Wp,
  Hp,
  horizontalMarginScale,
  fontScale,
  verticalMarginScale,
} from '../../utils/dimensions';
import {Image} from 'react-native-animatable';
import IMAGES from '../../assets/images';
import {COLORS} from '../../utils/constants';
import { fontFamily } from '../../utils/functions';

interface NoResultsProps {
  loading: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({loading}) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image source={IMAGES.iconRumor} style={styles.icon} />
        {!loading && <Text style={styles.titleText}>No results</Text>}
        {!loading && (
          <Text style={styles.text}>Please refine your search.</Text>
        )}
        {loading && <Text style={styles.text}>Loading...</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Wp(100),
    height: Hp(65),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    width: Wp(100),
    height: Hp(65),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: horizontalMarginScale(10),
  },
  text: {
    fontSize: fontScale(14),
    marginTop: verticalMarginScale(10),
  },
  titleText: {
    fontSize: fontScale(32),
    fontWeight: '700',
    fontFamily: fontFamily.RomieTrial_Bold,
    marginTop: verticalMarginScale(5),
    color: COLORS.black,
  },
});

export default NoResults;
