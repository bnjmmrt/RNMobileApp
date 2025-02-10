import React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../src/utils/constants';
import { fontFamily } from '../../../src/utils/functions';
import { radiusScale } from 'src/utils/dimensions';

type AvatarInitialsProps = {
  name?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  imgUrl?: string;
  onPress?: any
};

const AvatarInitials: React.FC<AvatarInitialsProps> = ({
  name,
  size = radiusScale(48),
  backgroundColor = COLORS.tabBorderColor,
  textColor = COLORS.black,
  imgUrl,
  onPress
}) => {
  const getInitials = (name: string): string => {
    if (!name) return '';

    const nameParts = name.trim().split(' ');
    const initials = nameParts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');

    return initials;
  };

  const initials = getInitials(name);

  return imgUrl ? (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={{ uri: imgUrl }}
        style={[
          styles.avatar,
          {
            width: radiusScale(size),
            height: radiusScale(size),
            borderRadius: radiusScale(size) / 2,
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
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize: radiusScale(size) / 3 }]}>
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
