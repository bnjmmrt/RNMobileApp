import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { COLORS, LABLE } from '../../utils/constants';
import { fontFamily, removeSignature } from '../../utils/functions';
import AvatarInitials from '../AvatarInitials';
import { CustomText } from '../CustomText';
import GradientSeprator from '../GradientSeprator';

interface Talent {
  id: string;
  name: string;
  imageKeyUrl?: string;
}

interface EventTalentProps {
  talents: Talent[];
}

const EventTalent: React.FC<EventTalentProps> = ({ talents }) => {
  const itemSeparatorComponent = () => {
    return <GradientSeprator />;
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>{LABLE.FEATURE_TALENT}</CustomText>
      <View style={styles.divider} />

      <FlatList
        data={talents}
        keyExtractor={item => item.id}
        horizontal={false}
        contentContainerStyle={styles.itemContainer}
        ItemSeparatorComponent={itemSeparatorComponent}
        renderItem={({ item }) => (
          <View style={styles.talentItem}>
            {item.imageKeyUrl && item.imageKeyUrl.includes('http') ? (
              <FastImage
                source={{ uri: removeSignature(item.imageKeyUrl) }}
                resizeMode={FastImage.resizeMode.cover}
                defaultSource={IMAGES.rumorLogo}
                style={styles.icon}
              />
            ) : (
              <AvatarInitials name={item.name} size={48} />
            )}
            <CustomText style={styles.name}>{item.name}</CustomText>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 16,
    paddingTop: 18,
    backgroundColor: COLORS.white,
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: COLORS.borderGray,
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginTop: 18,
  },
  itemContainer: {
    // paddingVertical: 10,
  },
  talentItem: {
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 16,
  },
  name: {
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
});

export default EventTalent;
