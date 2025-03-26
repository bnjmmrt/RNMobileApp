import IMAGES from '@images/index';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import { RootState } from 'src/redux/slices';
import { setRefresh } from 'src/redux/slices/rspvSlice';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import ButtonSmall from '../ButtonSmall';

interface FollowButtonProps {
  id: string;
  isFollowing: boolean;
  handleRefresh?: any;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  id,
  isFollowing,
  handleRefresh,
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();
  const { apiRequest } = useApi();

  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);
    setFollowing(!following);
    await followUnfollow(id, following);
    setLoading(false);

    handleRefresh && dispatch(setRefresh(true));
  };

  const followUnfollow = async (hostId: string, is_following: boolean) => {
    return is_following ? unFollowApi(hostId) : followApi(hostId);
  };

  const unFollowApi = async (hostId: string) => {
    const response: any = await apiRequest(
      'delete',
      `${EndPoint.host}/${hostId}/follow`,
      { userId },
    );
    return response?.status;
  };

  const followApi = async (hostId: string) => {
    const response: any = await apiRequest(
      'post',
      `${EndPoint.host}/${hostId}/follow`,
      { userId, hostId, follow: true },
    );
    return response?.status;
  };

  return (
    <ButtonSmall
      style={[
        styles.baseButtonStyle,
        loading
          ? styles.smallFollowBtnLoadingStyle
          : following
          ? styles.smallBtnStyle
          : styles.smallFollowBtnStyle,
      ]}
      title={following ? 'Following' : 'Follow'}
      colorTheme={following ? 'dark' : 'dark'}
      leftIcon={following ? IMAGES.check : null}
      borderType={loading ? 'SOLID' : following ? 'STRIPE' : 'SOLID'}
      onPress={handleFollow}
      loading={loading}
      disabled={loading}
    />
  );
};

const styles = StyleSheet.create({
  baseButtonStyle: {
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: radiusScale(100),
  },
  smallBtnStyle: {},
  smallFollowBtnLoadingStyle: { borderWidth: 2, borderColor: 'transparent' },
  smallFollowBtnStyle: { borderWidth: 2 },
});

export default FollowButton;
