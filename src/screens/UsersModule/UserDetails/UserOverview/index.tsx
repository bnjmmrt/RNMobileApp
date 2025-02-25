import IMAGES from '@images/index';
import moment from 'moment';
import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  TextStyle,
  View,
} from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import { CustomText } from 'src/component/CustomText';
import { UserDetailResponse } from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { horizontalMarginScale } from 'src/utils/dimensions';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';

interface UserOverviewProps {
  user: string;
}

const UserOverview: React.FC<UserOverviewProps> = ({ user }) => {
  const styles = createStyle();

  const { userDetails } = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({ user })})`
    ] as { data: UserDetailResponse } | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const socialPresenceData = [
    {
      icon: IMAGES.insta,
      value: userDetails?.socialStats?.instagramFollowersCount || 0,
    },
    {
      icon: IMAGES.linkdn,
      value: userDetails?.socialStats?.linkedinFollowersCount || 0,
    },
    {
      icon: IMAGES.snapchat,
      value: userDetails?.socialStats?.snapchatFollowersCount || 0,
    },
    {
      icon: IMAGES.tiktok,
      value: userDetails?.socialStats?.tiktokFollowersCount || 0,
    },
    {
      icon: IMAGES.x,
      value: userDetails?.socialStats?.xFollowersCount || 0,
    },
    {
      icon: IMAGES.yt,
      value: userDetails?.socialStats?.youtubeFollowersCount || 0,
    },
    {
      icon: IMAGES.fb,
      value: userDetails?.socialStats?.facebookFollowersCount || 0,
    },
  ];

  const totalFollowers = socialPresenceData.reduce(
    (total, item) => total + (item.value || 0),
    0,
  );

  const InfoRow = ({
    icon,
    title = '',
    titleCustomStyle,
  }: {
    title: string;
    icon: ImageSourcePropType;
    titleCustomStyle?: TextStyle;
  }) => {
    return (
      <View style={styles.infoRowContainer}>
        <Image source={icon} resizeMode="contain" style={styles.infoRowIcon} />
        <CustomText style={[styles.infoRowTitle, titleCustomStyle]}>
          {title}
        </CustomText>
      </View>
    );
  };

  const renderSocialPresenceRow = useCallback(({ item }: { item: any }) => {
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
    <UserDetailCard title={'Overview'}>
      <CustomText style={[styles.sectionTitle, { marginTop: 0 }]}>
        {'Information'}
      </CustomText>
      {userDetails?.gender ? (
        <InfoRow title={userDetails?.gender} icon={IMAGES.profileTab} />
      ) : null}
      {userDetails?.age ? (
        <InfoRow
          title={String(userDetails?.age || '')}
          icon={IMAGES.hourglass}
        />
      ) : null}
      {userDetails?.city ? (
        <InfoRow title={userDetails?.city} icon={IMAGES.location} />
      ) : null}
      {userDetails?.dateOfBirth ? (
        <InfoRow
          title={moment(userDetails?.dateOfBirth, 'MM/DD/YYYY').format(
            'DD MMM YYYY',
          )}
          icon={IMAGES.calender}
        />
      ) : null}
      {userDetails?.phoneNumber ? (
        <InfoRow title={userDetails?.phoneNumber} icon={IMAGES.phone} />
      ) : null}
      {userDetails?.email ? (
        <InfoRow
          title={userDetails?.email}
          icon={IMAGES.contact}
          titleCustomStyle={{ textTransform: 'none' }}
        />
      ) : null}

      {userDetails?.socialStats ? (
        <>
          <CustomText style={styles.sectionTitle}>
            {'Social Media Presence'}
          </CustomText>
          <FlatList
            data={socialPresenceData}
            renderItem={renderSocialPresenceRow}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ gap: horizontalMarginScale(4) }}
            contentContainerStyle={{ gap: horizontalMarginScale(4) }}
            numColumns={2}
          />
        </>
      ) : null}

      <>
        <CustomText style={styles.sectionTitle}>{'Total Following'}</CustomText>
        <View style={styles.totalFollowingContainer}>
          <CustomText style={styles.totalFollowing}>
            {totalFollowers || 0}
          </CustomText>
          {/* <CustomText style={styles.totalFollowingUnit}>{'M'}</CustomText> */}
        </View>
      </>
    </UserDetailCard>
  );
};

export default UserOverview;
