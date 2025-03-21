import FastImage, { ImageStyle } from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { radiusScale } from 'src/utils/dimensions';
import { COLORS } from '../../../src/utils/constants';
import { fontFamily } from '../../../src/utils/functions';

type AvatarInitialsProps = {
  name?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  imgUrl?: string;
  onPress?: any;
  containerStyle?: ViewStyle;
  listing?: boolean;
};

const AvatarInitials: React.FC<AvatarInitialsProps> = ({
  name,
  size = radiusScale(48),
  backgroundColor = COLORS.tabBorderColor,
  textColor = COLORS.black,
  imgUrl,
  onPress,
  containerStyle,
  listing = true,
}) => {
  const [isPhotoError, setIsPhotoError] = useState<boolean>(false);
  const getInitials = (name: string): string => {
    if (!name) return '';

    const nameParts = name.trim().split(' ');
    const initials = nameParts
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');

    return initials;
  };

  const initials = getInitials(name || '');

  return imgUrl ? (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.avatar,
        {
          width: radiusScale(size),
          height: radiusScale(size),
          borderRadius: radiusScale(size) / 2,
        },
        containerStyle,
      ]}>
      <FastImage
        source={{ uri: imgUrl }}
        defaultSource={IMAGES.rumorLogo}
        onError={() => setIsPhotoError(true)}
        onLoad={() => setIsPhotoError(false)}
        resizeMode={isPhotoError ? 'contain' : 'cover'}
        style={[
          styles.avatar,
          {
            width: '100%',
            height: '100%',
            borderRadius: radiusScale(size),
            backgroundColor,
          },
        ]}
      />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.avatar,
        {
          width: radiusScale(size),
          height: radiusScale(size),
          borderRadius: radiusScale(size) / 2,
          backgroundColor,
        },
        containerStyle,
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: listing
              ? radiusScale(size) / 2.5
              : radiusScale(size) / 1.5,
          },
        ]}>
        {initials}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default AvatarInitials;
