import IMAGES from '@images/index';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import ButtonSmall from 'src/component/ButtonSmall';
import Header from 'src/component/Header/Header';
import Title from 'src/component/Title/Title';
import { COLORS, LABLE } from 'src/utils/constants';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, verticalScale, Wp } from 'src/utils/dimensions';
import { fontFamily, removeSignature } from 'src/utils/functions';
import ReportHostView from './ReportHostView';
import ReportAndBlockHostView from './ReportandBlockView';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { mockProfileDetails, useFetchProfileDetailsQuery } from 'src/redux/actions/profileListApiAction';
import useApi from 'src/axios/useApi';
import FastImage from '@d11/react-native-fast-image';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import FollowButton from 'src/component/FollowButton/FollowButton';
import { useDispatch, useSelector } from 'react-redux';
import { setRefresh } from 'src/redux/slices/rspvSlice';
import { RootState } from 'src/redux/slices';
import { ROUTES } from 'src/navigation/Route';
import Blocked from 'src/assets/svgs/icons/Blocked.svg';

type ViewType = 'options' | 'report' | 'block' | 'unblock' | 'reportAndBlock' | null;

type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

const HostProfileScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheetRef | null>(null);
  const { params } = useRoute();
  const [activeView, setActiveView] = useState<ViewType>(null);
  const { goBack, setParams, navigate } = useNavigation<any>();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const roleId = useSelector(
    (state: RootState) => state.auth.roleId,
  );
  const refresh = useSelector((state: RootState) => state.rspv.refresh);



  const { data, isLoading, error, refetch, isSuccess } = useFetchProfileDetailsQuery(params?.hostId);
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
    }, [refresh])
  );
  // const data = mockProfileDetails;
  useEffect(() => {
    dispatch(setRefresh(false))
  }, [refresh])

  const handleOpenBottomSheet = (view: ViewType) => {
    setActiveView(view);
    bottomSheetRef.current?.open();
  };
  const getHostRoleIdFromAPI = async () => {
    try {
      const response = await apiRequest('post', 'users/v1/auth/get-user-with-roles-by-id', { id: params?.hostId });
      const hostRole = response.data.roles.find(role => role.name === "host");
      return hostRole ? hostRole.id : null;
    } catch (error) {
      console.error("Error fetching user roles:", error);
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
        return <ReportHostView roleId={roleId} hostRoleId={hostRoleId} userId={userId} onClose={() => bottomSheetRef.current?.close()} hostId={params?.hostId} />;
      case 'block':
        return (
          <BlockHostView
            onPress={(e: string) => handleOpenBottomSheet(e as ViewType)}
            onClose={(e) => {
              bottomSheetRef.current?.close()
              if (e) {
                refetch()
              }
            }}
            userId={userId}
            hostId={params?.hostId}
            roleId={roleId} hostRoleId={hostRoleId}
          />
        );
      case 'unblock':
        return (
          <UnBlockHostView
            onPress={(e: string) => handleOpenBottomSheet(e as ViewType)}
            onClose={(e) => {
              bottomSheetRef.current?.close()
              e && refetch();
            }}
            userId={userId}
            hostId={params?.hostId}
            roleId={roleId} hostRoleId={hostRoleId}
          />
        );
      case 'reportAndBlock':
        return <ReportAndBlockHostView
          roleId={roleId} hostRoleId={hostRoleId}
          userId={userId} onClose={(e) => {
            bottomSheetRef.current?.close()
            e && refetch();
          }} hostId={params?.hostId} />;
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

  const handlEventPress = (item) => {
    navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: item
    });
  };
  const socialMediaData = Object.keys(socialMediaLinks)
    .map((key) => ({
      id: key,
      icon: IMAGES[key],
      url: socialMediaLinks[key],
    }))
    .filter((item) => item.icon && item.url !== "");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header
        showProgressBar={false}
        rightIcon={IMAGES.dots}
        onPressRightIcon={() => profile?.isMemberBlockedHost ? handleOpenBottomSheet('unblock') : handleOpenBottomSheet('options')}
        showBackButton={true}
      />

      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: horizontalMarginScale(20) }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: verticalMarginScale(16), gap: verticalMarginScale(4) }}>
            <View style={{ marginBottom: verticalMarginScale(12) }}>
              <AvatarInitials imgUrl={removeSignature(profile?.companyLogo) || ''} size={radiusScale(96)} />
              {profile?.isMemberBlockedHost && <Blocked height={32} width={32} style={{ position: 'absolute', bottom: 0, right: -5 }} />}
            </View>
            <Title
              title={profile?.companyName || 'Company Name'}
              subTitle={profile?.bio || 'Bio not available'}
              align="center"
            />
            <FlatList
              horizontal
              contentContainerStyle={
                socialMediaData.length > 0
                  ? { marginBottom: verticalMarginScale(16), marginTop: verticalMarginScale(6) }
                  : {}
              }
              data={socialMediaData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    item?.url ? Linking.openURL(item?.url) : FlashMessageComponent.show('success', 'Link not available')
                  }
                >
                  <Image style={{ width: 20, height: 20, marginRight: verticalMarginScale(8) }} source={item.icon} />
                </TouchableOpacity>
              )}
            />
            <FollowButton
              isFollowing={profile?.isMemberFollowingHost}
              id={profile?.id}
              handleRefresh={true}
            />
          </View>
          <Text style={styles.headerText}>Upcoming Events</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.dateText}>No upcoming events.</Text>}
            contentContainerStyle={{ gap: 16, marginVertical: verticalMarginScale(12) }}
            data={profile?.upcomingEvents || []}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { handlEventPress(item) }}>
                <FastImage
                  defaultSource={IMAGES.eventCoverPlaceholders1}
                  style={{ width: Wp('42%'), height: verticalScale(245), borderRadius: 8 }}
                  source={{ uri: removeSignature(item?.imageFlyer) }}
                />
                <View style={{ width: Wp('42%') }}>
                  <Text style={styles.eventNameText} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.dateText}>{item.startDate}</Text>
                  <Text style={styles.dateText} numberOfLines={1}>{item?.eventLocation?.city}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <Text style={styles.headerText}>Past Events</Text>
          <FlatList
            horizontal
            ListEmptyComponent={<Text style={styles.dateText}>No past events.</Text>}
            contentContainerStyle={{ gap: 16, marginTop: verticalMarginScale(12), marginBottom: 100 }}
            data={profile?.pastEvents || []}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { handlEventPress(item) }}>
                <FastImage
                  defaultSource={IMAGES.eventCoverPlaceholders1}
                  style={{ width: Wp('42%'), height: verticalScale(245), borderRadius: 8 }}
                  source={{ uri: removeSignature(item.imageFlyer) }}
                />
                <View style={{ width: Wp('42%') }}>
                  <Text style={styles.eventNameText} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.dateText}>{item.startDate}</Text>
                  <Text style={styles.dateText} numberOfLines={1}>{item?.eventLocation?.city}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
      <BottomSheetComponent
        snapPoints={[getSnapPoints()]}
        ref={bottomSheetRef}
        onClose={() => setActiveView(null)}
      >
        {renderBottomSheetContent()}
      </BottomSheetComponent>
    </SafeAreaView>
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

const BlockHostView: React.FC<BlockHostViewProps> = ({ onClose, onPress, userId, hostId, roleId, hostRoleId }) => {
  const { apiRequest, loading, error } = useApi();
  const handleBlock = async () => {
    try {
      const response = await apiRequest('post', `users/v1/auth/users/${userId}/hosts/${hostId}/block`, {
        blockedByRoleId: roleId,
        blockedToRoleId: hostRoleId,
      });
      if (response) {
        FlashMessageComponent.show('success', 'Host has been blocked successfully');
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
      <TouchableOpacity disabled={loading} onPress={handleBlock} style={styles.redButton}>
        {loading ? <ActivityIndicator /> : <Text style={[styles.optionText, { color: COLORS.white }]}>Block</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('reportAndBlock')} style={styles.blackStripe}>
        <Text style={styles.optionText}>Report & Block</Text>
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

const UnBlockHostView: React.FC<UnBlockHostViewProps> = ({ onClose, onPress, userId, hostId, roleId, hostRoleId }) => {
  const { apiRequest, loading, error } = useApi();
  const handleUnblock = async () => {
    try {
      const response = await apiRequest('post', `users/v1/auth/users/${userId}/hosts/${hostId}/unblock`, {
        blockedByRoleId: roleId,
        blockedToRoleId: hostRoleId,
      });
      FlashMessageComponent.show('success', 'Host has been unblocked successfully');
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
        <Text style={styles.optionText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};


const RenderOptions = ({ onClose, onPress }: { onClose: () => void }) => (
  <View style={{ paddingHorizontal: 12, gap: 8 }}>
    <TouchableOpacity onPress={() => onPress('report')} style={styles.greyStripeButton}>
      <Text style={styles.optionText}>Report Host</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onPress('block')} style={styles.greyStripeButton}>
      <Text style={styles.optionText}>Block Host</Text>
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
    marginTop: 12
  },
  headerText: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    marginTop: verticalMarginScale(16),
  },
  eventNameText: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
    marginTop: verticalMarginScale(12),
  },
  dateText: {
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.light_gray,
    marginTop: verticalMarginScale(2)
  },
  optionText: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
  },
  greyStripeButton: {
    paddingVertical: verticalMarginScale(12),
    alignItems: 'center', borderRadius: 1000, borderWidth: 1, borderColor: COLORS.borderGray
  },
  redButton: {
    backgroundColor: COLORS.errorText,
    justifyContent: 'center', alignItems: 'center', borderRadius: 1000, height: 48, marginTop: verticalMarginScale(12)
  },
  blackStripe: {
    paddingVertical: verticalMarginScale(12),
    alignItems: 'center', borderRadius: 1000,
    borderWidth: 2, borderColor: COLORS.black, height: 48
  }
});

export default HostProfileScreen;
