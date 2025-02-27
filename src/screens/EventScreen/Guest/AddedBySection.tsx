import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  radiusScale,
  verticalMarginScale,
  horizontalMarginScale,
  verticalScale,
  horizontalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import FastImage from '@d11/react-native-fast-image';

interface AddedBySectionProps {
  user?: {
    name: string;
    avatar?: string;
    id: string;
  };
}

const AddedBySection: React.FC<AddedBySectionProps> = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <View style={styles.addedByContainer}>
      {user.avatar ? (
        <FastImage source={{ uri: user.avatar }} style={styles.addedByAvatar} />
      ) : (
        <View style={styles.addedByAvatarPlaceholder}>
          <Text style={styles.addedByAvatarText}>{user.name.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.addedByUser}>
        <Text style={styles.addedByText}>Added by</Text>
        <Text style={styles.addedByName}>{user.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addedByContainer: {
    marginTop: verticalMarginScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(8),
    borderColor: COLORS.neutralBorder,
    borderWidth: verticalScale(1),
    paddingVertical: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(16),
  },
  addedByText: {
    fontSize: fontScale(11),
    color: COLORS.light_text,
    marginBottom: verticalMarginScale(2),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  addedByUser: {
    marginLeft: horizontalMarginScale(8),
  },
  addedByAvatar: {
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: radiusScale(100),
  },
  addedByAvatarPlaceholder: {
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: radiusScale(100),
    backgroundColor: COLORS.lighter_gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedByAvatarText: {
    fontSize: fontScale(12),
    color: COLORS.dark_gray,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  addedByName: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
});

export default AddedBySection;
