import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, FlatList, Pressable, Alert } from 'react-native';
import { fontFamily, removeSignature } from '../../utils/functions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';
import FastImage from '@d11/react-native-fast-image';
import AvatarInitials from '../AvatarInitials';
import { fontScale, horizontalMarginScale, verticalMarginScale } from 'src/utils/dimensions';
import GradientSeprator from '../GradientSeprator';
import { CustomText } from '../CustomText';
import CircleButtonOverlay from '../BackButton/CircleButtonOverlay';
import FeatureTalentBottomSheet from '../BottomSheet/FeatureTalentBottomSheet';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import DeleteAccountBottomSheet from '../BottomSheet/DeleteAccountBottomSheet';
import DeleteTalentBottomSheet from './DeleteTalentBottomSheet';

interface Talent {
  id: string;
  name: string;
  imageKeyUrl?: string;
}

interface HostEventTalentProps {
  talents: Talent[];
  onTalentChange: (talents: Talent[]) => void;
}

const HostEventTalent: React.FC<HostEventTalentProps> = ({ talents: initialTalents, onTalentChange }) => {
  const featureTalentSheet = useRef<any>(null);
  const deleteRef = useRef<any>(null);
  const [talents, setTalents] = React.useState<Talent[]>(initialTalents);
  const [selectedTalent, setSelectedTalent] = React.useState<Talent | null>(null);

  useEffect(() => {
    onTalentChange(talents);
  }, [talents])

  const handleDeleteTalent = (id: string) => {
    setTalents((prevTalents) =>
      prevTalents
        .map((talent) =>
          talent.id === id && (talent?.action === "update" || !talent?.action)
            ? { ...talent, action: "delete" }
            : talent
        )
        .filter((talent) => talent.id !== id || talent?.action === "delete"));
  };
  const handleUpdateTalent = (newTalent: Talent) => {
    setTalents((prevTalents) =>
      prevTalents.some((talent) => talent.id === newTalent.id)
        ? prevTalents.map((talent) =>
          talent.id === newTalent.id ? { ...talent, ...newTalent } : talent
        )
        : [...prevTalents, newTalent]
    );
    featureTalentSheet.current?.close();
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CustomText style={styles.title}>{LABLE.FEATURE_TALENT}</CustomText>
        <CircleButtonOverlay
          onPress={() => {
            setSelectedTalent(null);
            featureTalentSheet?.current?.open()
          }}
          customStyle={{ position: 'relative' }}
          imageSource={IMAGES.add}
          size={32}
          theme={COLORS.LIGHT}
        />
      </View>

      {/* Talent List */}
      <FlatList
        data={talents.filter((talent) => talent?.action !== "delete")}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={GradientSeprator}
        contentContainerStyle={styles.itemContainer}
        renderItem={({ item }) => (
          <Pressable style={styles.talentItem} onPress={() => Alert.alert('In Progress')}>
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
            <Text style={styles.name}>{item.name}</Text>

            <CircleButtonOverlay
              onPress={() => {
                setSelectedTalent(item);
                featureTalentSheet.current?.open();
              }}
              customStyle={{ position: 'relative' }}
              imageSource={IMAGES.edit}
              size={30}
            />

            <CircleButtonOverlay
              onPress={() => {
                setSelectedTalent(item);
                deleteRef?.current?.open();
              }}
              customStyle={{ position: 'relative', marginLeft: 6 }}
              imageSource={IMAGES.tras}
              size={30}
            />
          </Pressable>
        )}
      />

      <FeatureTalentBottomSheet
        ref={featureTalentSheet}
        onPress={handleUpdateTalent}
        submitButtonText={"Save"}
        cancelButtonText={BUTTON_LABLE.CANCEL}
        snapPoints={['65%']}
        title={selectedTalent ? 'Edit Featured Talent' : 'Add Featured Talent'}
        talent={selectedTalent}
      />
      <DeleteTalentBottomSheet ref={deleteRef} handleDelete={() => handleDeleteTalent(selectedTalent?.id)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalMarginScale(12),
  },
  title: {
    fontSize: fontScale(14),
    color: COLORS.black,
    flex: 1,
    alignSelf: 'flex-end',
    lineHeight: 16,
  },
  itemContainer: {
    paddingVertical: verticalMarginScale(10),
  },
  talentItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(8),
    borderRadius: 10,
    backgroundColor: COLORS.borderGray,
    marginBottom: 10,
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: COLORS.borderGray,
  },
  name: {
    color: COLORS.black2,
    fontSize: fontScale(14),
    padding: 10,
    flex: 1,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
});

export default HostEventTalent;
