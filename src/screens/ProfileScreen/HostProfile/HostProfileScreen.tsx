import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Blocked from 'src/assets/svgs/icons/Blocked.svg';
import useApi from 'src/axios/useApi';
import AvatarInitials from 'src/component/AvatarInitials';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import FollowButton from 'src/component/FollowButton/FollowButton';
import Header from 'src/component/Header/Header';
import Title from 'src/component/Title/Title';
import { ROUTES } from 'src/navigation/Route';
import { useFetchProfileDetailsQuery } from 'src/redux/actions/profileListApiAction';
import { RootState } from 'src/redux/slices';
import { setRefresh } from 'src/redux/slices/rspvSlice';
import { COLORS, LABLE, SOCIAL_LINKS } from 'src/utils/constants';
import { convertUTCToTimeZoneFormat } from 'src/utils/dateFunctions';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import {
  changeSafeAreaViewConfig,
  fontFamily,
  removeSignature,
} from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import ReportHostView from './ReportHostView';
import ReportAndBlockHostView from './ReportandBlockView';

type ViewType =
  | 'options'
  | 'report'
  | 'block'
  | 'unblock'
  | 'reportAndBlock'
  | null;

type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

const HostProfileScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheetRef | null>(null);
  const { params } = useRoute();
  const [activeView, setActiveView] = useState<ViewType>(null);
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const roleId = useSelector((state: RootState) => state.auth.roleId);
  const refresh = useSelector((state: RootState) => state.rspv.refresh);

  const { data, isLoading, error, refetch, isSuccess } =
    useFetchProfileDetailsQuery(params?.hostId);
  const { apiRequest, loading: apiLoading, error: apiError } = useApi();

  const [hostRoleId, setHostRoleId] = useState(null);

  useEffect(() => {
    const fetchHostRoleId = async () => {
      const id = await getHostRoleIdFromAPI();
      setHostRoleId(id);
    };

    fetchHostRoleId();
  }, [params?.hostId]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refresh]),
  );
  // const data = mockProfileDetails;
  useEffect(() => {
    dispatch(setRefresh(false));
  }, [refresh]);

  const handleOpenBottomSheet = (view: ViewType) => {
    setActiveView(view);
    bottomSheetRef.current?.open();
  };
  const getHostRoleIdFromAPI = async () => {
    try {
      const response = await apiRequest(
        'post',
        'users/v1/auth/get-user-with-roles-by-id',
        { id: params?.hostId },
      );
      const hostRole = response.data.roles.find(role => role.name === 'host');
      return hostRole ? hostRole.id : null;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return null;
    }
  };

  const renderBottomSheetContent = () => {
    switch (activeView) {
      case 'options':
        return (
          <RenderOptions
            onPress={(e: string) => handleOpenBottomSheet(e as ViewType)}
            onClose={() => bottomSheetRef.current?.close()}
          />
        );
      case 'report':
        return (
          <ReportHostView
            roleId={roleId}
            hostRoleId={hostRoleId}
            userId={userId}
            onClose={() => bottomSheetRef.current?.close()}
            hostId={params?.hostId}
          />
        );
      case 'block':
        return (
          <BlockHostView
            onPress={(e: string) => handleOpenBottomSheet(e as ViewType)}
            onClose={e => {
              bottomSheetRef.current?.close();
              if (e) {
                refetch();
              }
            }}
            userId={userId}
            hostId={params?.hostId}
            roleId={roleId}
            hostRoleId={hostRoleId}
          />
        );
      case 'unblock':
        return (
          <UnBlockHostView
            onPress={(e: string) => handleOpenBottomSheet(e as ViewType)}
            onClose={e => {
              bottomSheetRef.current?.close();
              e && refetch();
            }}
            userId={userId}
            hostId={params?.hostId}
            roleId={roleId}
            hostRoleId={hostRoleId}
          />
        );
      case 'reportAndBlock':
        return (
          <ReportAndBlockHostView
            roleId={roleId}
            hostRoleId={hostRoleId}
            userId={userId}
            onClose={e => {
              bottomSheetRef.current?.close();
              e && refetch();
            }}
            hostId={params?.hostId}
          />
        );
      default:
        return null;
    }
  };

  const getSnapPoints = (): string => {
    switch (activeView) {
      case 'options':
        return '20%';
      case 'block':
        return '40%';
      case 'unblock':
        return '40%';
      default:
        return '55%';
    }
  };

  const profile = data?.data;
  const socialMediaLinks = profile?.socialMedia || {};

  const handlEventPress = item => {
    navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: item,
    });
  };
  const socialMediaData = [
    ...(profile?.website
      ? [
        {
          id: 'website',
          icon: IMAGES['website_black'],
          url: profile?.website,
        },
      ]
      : []),
    ...Object.keys(socialMediaLinks)
      .map(key => ({
        id: key,
        icon: IMAGES[key + '_black'],
        url: socialMediaLinks[key],
      }))
      .filter(item => item.icon && item.url !== ''),
  ];

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header
        showProgressBar={false}
        rightIcon={IMAGES.dots}
        onPressRightIcon={() =>
          profile?.isMemberBlockedHost
            ? handleOpenBottomSheet('unblock')
            : handleOpenBottomSheet('options')
        }
        showBackButton={true}
      />
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={COLORS.black} />
        </View>
      ) : (
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          <View style={{}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: verticalMarginScale(16),
                gap: verticalMarginScale(4),
                paddingHorizontal: horizontalMarginScale(20),
              }}>
              <View style={{ marginBottom: verticalMarginScale(12) }}>
                <AvatarInitials
                  imgUrl={removeSignature(profile?.companyLogo) || ''}
                  size={radiusScale(96)}
                />
                {profile?.isMemberBlockedHost && (
                  <Blocked
                    height={32}
                    width={32}
                    style={{ position: 'absolute', bottom: 0, right: -5 }}
                  />
                )}
              </View>
              <Title
                numberOfLinesTitle={2}
                numberOfLinesSubtitle={4}
                title={profile?.companyName || 'Company Name'}
                subTitle={profile?.bio || ''}
                align="center"
              />
              {socialMediaData.length > 0 ? (
                <FlatList
                  horizontal
                  contentContainerStyle={
                    socialMediaData.length > 0
                      ? {
                        marginBottom: verticalMarginScale(16),
                        marginTop: verticalMarginScale(6),
                      }
                      : {}
                  }
                  data={socialMediaData}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (item?.url) {
                          let url = item.url;
                          if (item?.id == 'x') {
                            url = SOCIAL_LINKS.X + item?.url;
                          } else if (item?.id == 'tiktok') {
                            url = SOCIAL_LINKS.TikTok + item?.url;
                          } else if (item?.id == 'youtube') {
                            url = SOCIAL_LINKS.YouTube + item?.url;
                          } else if (item?.id == 'facebook') {
                            url = SOCIAL_LINKS.Facebook + item?.url;
                          } else if (item?.id == 'linkedin') {
                            url = SOCIAL_LINKS.LinkedIn + item?.url;
                          } else if (item?.id == 'instagram') {
                            url = SOCIAL_LINKS.Instagram + item?.url;
                          } else {
                            url = 'https://' + item?.url;
                          }
                          Linking.canOpenURL(url)
                            .then(() => {
                              Linking.openURL(url);
                            })
                            .catch(err => {
                              FlashMessageComponent.show(
                                'error',
                                'Could not able to load the url',
                              );
                            });
                        } else {
                          FlashMessageComponent.show(
                            'success',
                            'Link not available',
                          );
                        }
                      }}>
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: verticalMarginScale(12),
                        }}
                        source={item.icon}
                      />
                    </TouchableOpacity>
                  )}
                />
              ) : null}

              <FollowButton
                isFollowing={profile?.isMemberFollowingHost}
                id={profile?.id}
                handleRefresh={true}
              />
            </View>
            <CustomText style={styles.headerText}>Upcoming Events</CustomText>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <CustomText style={styles.emptyEventMessage}>
                  No upcoming events.
                </CustomText>
              }
              ListHeaderComponent={<></>}
              ListFooterComponent={<></>}
              contentContainerStyle={{
                gap: horizontalMarginScale(20),
                marginVertical: verticalMarginScale(12),
              }}
              data={profile?.upcomingEvents || []}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handlEventPress(item);
                  }}>
                  <FastImage
                    style={{
                      width: Wp('42%'),
                      height: verticalScale(245),
                      borderRadius: 8,
                      backgroundColor: COLORS.borderGray,
                    }}
                    source={{ uri: removeSignature(item?.imageFlyer) }}
                  />
                  <View style={{ width: Wp('42%') }}>
                    <CustomText
                      style={styles.eventNameText}
                      textProps={{ numberOfLines: 1 }}>
                      {item.name}
                    </CustomText>
                    <CustomText style={styles.dateText}>
                      {convertUTCToTimeZoneFormat(
                        item.startDate,
                        item.timeZone,
                        'MMM DD, hh:mm A',
                      )}
                      {/* {moment(item.startDate, 'MM/DD/YYYY HH:mm').format(
                        'MMM DD, hh:mm A',
                      )} */}
                    </CustomText>
                    <CustomText
                      style={styles.dateText}
                      textProps={{ numberOfLines: 1 }}>
                      {item?.eventLocation?.city}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              )}
            />
            <CustomText style={styles.headerText}>Past Events</CustomText>
            <FlatList
              horizontal
              ListEmptyComponent={
                <CustomText style={styles.emptyEventMessage}>
                  No past events.
                </CustomText>
              }
              ListHeaderComponent={<></>}
              ListFooterComponent={<></>}
              contentContainerStyle={{
                gap: horizontalMarginScale(20),
                marginTop: verticalMarginScale(12),
                marginBottom: 100,
              }}
              data={profile?.pastEvents || []}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handlEventPress(item);
                  }}>
                  <FastImage
                    style={{
                      width: Wp('42%'),
                      height: verticalScale(245),
                      borderRadius: 8,
                      backgroundColor: COLORS.borderGray,
                    }}
                    source={{ uri: removeSignature(item.imageFlyer) }}
                  />
                  <View style={{ width: Wp('42%') }}>
                    <CustomText
                      style={styles.eventNameText}
                      textProps={{ numberOfLines: 1 }}>
                    vaihskhhshsh kjh khdks 
                    </CustomText>
                    <CustomText style={styles.dateText}>
                      {convertUTCToTimeZoneFormat(
                        item.startDate,
                        item.timeZone,
                        'MMM DD, hh:mm A',
                      )}
                    </CustomText>
                    <CustomText
                      style={styles.dateText}
                      textProps={{ numberOfLines: 1 }}>
                      {item?.eventLocation?.city}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
      )}
      <BottomSheetComponent
        snapPoints={[getSnapPoints()]}
        ref={bottomSheetRef}
        onClose={() => setActiveView(null)}>
        {renderBottomSheetContent()}
      </BottomSheetComponent>
    </View>
  );
};

interface BlockHostViewProps {
  onClose: Function;
  onPress: (view: string) => void;
  userId: string;
  hostId: string;
  hostRoleId: string;
  roleId: string;
}

const BlockHostView: React.FC<BlockHostViewProps> = ({
  onClose,
  onPress,
  userId,
  hostId,
  roleId,
  hostRoleId,
}) => {
  const { apiRequest, loading, error } = useApi();
  const handleBlock = async () => {
    try {
      const response = await apiRequest(
        'post',
        `users/v1/auth/users/${userId}/hosts/${hostId}/block`,
        {
          blockedByRoleId: roleId,
          blockedToRoleId: hostRoleId,
        },
      );
      if (response) {
        FlashMessageComponent.show(
          'success',
          'Host has been blocked successfully',
        );
        onClose(true);
      } else {
        // Alert.alert('Error', response?.message || 'Something went wrong');
      }
    } catch (error) {
      // Alert.alert('Error', error?.message || 'Failed to block host');
    }
  };

  return (
    <View style={{ paddingHorizontal: 12, gap: 8 }}>
      <Title
        align="center"
        title="Block Host"
        subTitle={`Are you sure you want to block this host?\nIf they invite you to an event in the future, your invite will automatically be declined.`}
      />
      <TouchableOpacity
        disabled={loading}
        onPress={handleBlock}
        style={styles.redButton}>
        {loading ? (
          <ActivityIndicator color={COLORS.black} />
        ) : (
          <CustomText style={[styles.optionText, { color: COLORS.white }]}>
            Block
          </CustomText>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress('reportAndBlock')}
        style={styles.blackStripe}>
        <CustomText style={styles.optionText}>Report & Block</CustomText>
      </TouchableOpacity>
    </View>
  );
};

interface UnBlockHostViewProps {
  onClose: Function;
  onPress: (view: string) => void;
  userId: string;
  hostId: string;
  hostRoleId: string;
  roleId: string;
}

const UnBlockHostView: React.FC<UnBlockHostViewProps> = ({
  onClose,
  onPress,
  userId,
  hostId,
  roleId,
  hostRoleId,
}) => {
  const { apiRequest, loading, error } = useApi();
  const handleUnblock = async () => {
    try {
      const response = await apiRequest(
        'post',
        `users/v1/auth/users/${userId}/hosts/${hostId}/unblock`,
        {
          blockedByRoleId: roleId,
          blockedToRoleId: hostRoleId,
        },
      );
      FlashMessageComponent.show(
        'success',
        'Host has been unblocked successfully',
      );
      onClose(true);
    } catch (error) {
      // Alert.alert('Error', error?.message || 'Failed to unblock host');
    }
  };

  return (
    <View style={{ paddingHorizontal: 12, gap: 8 }}>
      <Title
        align="center"
        title="Unblock Host"
        subTitle={LABLE.HOST_UNBLOCK_MESSAGE}
      />

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={'Unblock'}
        loading={loading}
        colorTheme="dark"
        onPress={handleUnblock}
      />
      <TouchableOpacity onPress={onClose} style={styles.blackStripe}>
        <CustomText style={styles.optionText}>Cancel</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const RenderOptions = ({ onClose, onPress }: { onClose: () => void }) => (
  <View style={{ paddingHorizontal: 12, gap: 8 }}>
    <TouchableOpacity
      onPress={() => onPress('report')}
      style={styles.greyStripeButton}>
      <CustomText style={styles.optionText}>Report Host</CustomText>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => onPress('block')}
      style={styles.greyStripeButton}>
      <CustomText style={styles.optionText}>Block Host</CustomText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  smallBtnStyle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    marginTop: 8,
    marginBottom: 8,
  },
  btnStyle: {
    borderRadius: 100,
    height: 48,
    width: '100%',
    marginTop: 12,
  },
  headerText: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    marginTop: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(20),
  },
  eventNameText: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    marginTop: verticalMarginScale(12),
  },
  emptyEventMessage: {
    color: COLORS.light_gray,
    marginTop: verticalMarginScale(2),
  },
  dateText: {
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.light_gray,
    marginTop: verticalMarginScale(2),
  },
  optionText: {
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  greyStripeButton: {
    paddingVertical: verticalMarginScale(12),
    alignItems: 'center',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  redButton: {
    backgroundColor: COLORS.errorText,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    height: 48,
    marginTop: verticalMarginScale(12),
  },
  blackStripe: {
    paddingVertical: verticalMarginScale(12),
    alignItems: 'center',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: COLORS.black,
    height: 48,
  },
});

export default HostProfileScreen;
