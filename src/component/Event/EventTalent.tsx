import React from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';
import FastImage from '@d11/react-native-fast-image';
import AvatarInitials from '../AvatarInitials';
import { fontScale } from 'src/utils/dimensions';

interface Talent {
  id: string;
  name: string;
  imageKeyUrl?: string;
}

interface EventTalentProps {
  talents: Talent[];
}

const EventTalent: React.FC<EventTalentProps> = ({ talents }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{LABLE.FEATURE_TALENT}</Text>
      <View style={styles.divider} />

      <FlatList
        data={talents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.itemContainer}
        renderItem={({ item }) => (
          <View style={styles.talentItem}>
            {item.imageKeyUrl && item.imageKeyUrl.includes("http") ? (
              <FastImage
                source={{ uri: item.imageKeyUrl }}
                resizeMode={FastImage.resizeMode.contain}
                defaultSource={IMAGES.rumorLogo}
                style={styles.icon}
              />
            ) : (
              <AvatarInitials name={item.name} size={48} />
            )}
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    borderRadius: 15,
    padding: 15,
    backgroundColor: COLORS.white,
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: COLORS.borderGray,
  },
  title: {
    color: COLORS.black2,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  talentItem: {
    alignItems: 'center',
    marginRight: 15,
    flexDirection: 'row'
  },
  name: {
    color: COLORS.black2,
    fontSize: fontScale(14),
    padding: 10,
    fontFamily: fontFamily.ABCDiatype_Bold,
  },
});

export default EventTalent;
