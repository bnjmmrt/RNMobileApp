import IMAGES from '@images/index';
import React, {useCallback} from 'react';
import {FlatList, Image, ImageSourcePropType, View} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';

const dummySocialData = [
  {
    icon: IMAGES.insta,
    value: '1233432',
  },
  {
    icon: IMAGES.linkdn,
    value: '',
  },
  {
    icon: IMAGES.snapchat,
    value: '',
  },
  {
    icon: IMAGES.tiktok,
    value: '',
  },
  {
    icon: IMAGES.x,
    value: '',
  },
  {
    icon: IMAGES.yt,
    value: '',
  },
  {
    icon: IMAGES.fb,
    value: '',
  },
];

interface UserOverviewProps {}

const UserOverview: React.FC<UserOverviewProps> = ({}) => {
  const styles = createStyle();

  const InfoRow = ({
    icon,
    title,
  }: {
    title: string;
    icon: ImageSourcePropType;
  }) => {
    return (
      <View style={styles.infoRowContainer}>
        <Image source={icon} resizeMode="contain" style={styles.infoRowIcon} />
        <CustomText style={styles.infoRowTitle}>{title}</CustomText>
      </View>
    );
  };

  const renderSocialPresenceRow = useCallback(({item}: {item: any}) => {
    return (
      <View style={styles.socialPresenceRowContainer}>
        <Image
          source={item.icon}
          resizeMode="contain"
          style={styles.socialPresenceRowIcon}
        />
        <CustomText style={styles.socialPresenceRowValue}>
          {item.value || '--'}
        </CustomText>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <UserDetailCard title={'Overview'}>
        <CustomText style={[styles.sectionTitle, {marginTop: 0}]}>
          {'Information'}
        </CustomText>
        <InfoRow title="Female" icon={IMAGES.profileTab} />
        <InfoRow title="39" icon={IMAGES.hourglass} />
        <InfoRow title="Chicago" icon={IMAGES.location} />
        <InfoRow title="22 Oct 1995" icon={IMAGES.calender} />
        <InfoRow title="(684) 555-0102" icon={IMAGES.phone} />
        <InfoRow title="bessie.cooper@example.com" icon={IMAGES.contact} />

        <CustomText style={styles.sectionTitle}>
          {'Social Media Presence'}
        </CustomText>
        <FlatList
          data={dummySocialData}
          renderItem={renderSocialPresenceRow}
          keyExtractor={(item, index) => index.toString()}
          columnWrapperStyle={{gap: 4}}
          contentContainerStyle={{gap: 4}}
          numColumns={2}
        />

        <CustomText style={styles.sectionTitle}>{'Total Following'}</CustomText>
        <View style={styles.totalFollowingContainer}>
          <CustomText style={styles.totalFollowing}>{'12.2'}</CustomText>
          <CustomText style={styles.totalFollowingUnit}>{'M'}</CustomText>
        </View>
      </UserDetailCard>
    </View>
  );
};

export default UserOverview;
