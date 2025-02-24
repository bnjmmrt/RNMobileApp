import React from 'react';
import { Text, StyleSheet, View, FlatList, Pressable, Alert } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';
import FastImage from '@d11/react-native-fast-image';
import AvatarInitials from '../AvatarInitials';
import { fontScale, verticalMarginScale } from 'src/utils/dimensions';
import GradientSeprator from '../GradientSeprator';
import { CustomText } from '../CustomText';
import CircleButtonOverlay from '../BackButton/CircleButtonOverlay';

interface Talent {
  id: string;
  name: string;
  imageKeyUrl?: string;
}

interface HostEventTalentProps {
  talents: Talent[];
}

const HostEventTalent: React.FC<HostEventTalentProps> = ({ talents }) => {

  const itemSeparatorComponent = () => {
    return <GradientSeprator />;
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: verticalMarginScale(12) }}>
        <CustomText style={styles.title}>{LABLE.FEATURE_TALENT}</CustomText>
        <CircleButtonOverlay onPress={() => { }} customStyle={{ position: 'relative', }} imageSource={IMAGES.plus} size={36} theme={COLORS.LIGHT} />

      </View>

      <FlatList
        data={talents}
        keyExtractor={(item) => item.id}
        horizontal={false}
        contentContainerStyle={styles.itemContainer}
        renderItem={({ item }) => (
          <Pressable style={styles.talentItem} onPress={() => Alert.alert("Inprogress")}>
            {item.imageKeyUrl && item.imageKeyUrl.includes("http") ? (
              <FastImage
                source={{ uri: item.imageKeyUrl }}
                resizeMode={FastImage.resizeMode.cover}
                defaultSource={IMAGES.rumorLogo}
                style={styles.icon}
              />
            ) : (
              <AvatarInitials name={item.name} size={48} />
            )}
            <Text style={styles.name}>{item.name}</Text>
            <CircleButtonOverlay onPress={() => { }} customStyle={{ position: 'relative' }} imageSource={IMAGES.edit} size={36} />
            <View style={{ width: 10 }}></View>
            <CircleButtonOverlay onPress={() => { }} customStyle={{ position: 'relative' }} imageSource={IMAGES.trash} size={36} />

          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: COLORS.borderGray,
  },
  title: {
    fontSize: fontScale(14),
    color: COLORS.black,
    flex: 1,
    alignSelf: 'flex-end',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginVertical: 10,
  },
  itemContainer: {
    paddingVertical: verticalMarginScale(10),
  },
  talentItem: {
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: COLORS.borderGray
  },
  name: {
    color: COLORS.black2,
    fontSize: fontScale(14),
    padding: 10,
    flex: 1,
    fontFamily: fontFamily.ABCDiatype_Bold,
  },
});

export default HostEventTalent;
