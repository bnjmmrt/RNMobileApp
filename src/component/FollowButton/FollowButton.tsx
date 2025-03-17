import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import ButtonSmall from '../ButtonSmall';
import IMAGES from '@images/index';
import useApi from 'src/axios/useApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { setRefresh } from 'src/redux/slices/rspvSlice';
import { EndPoint } from 'src/ApiManager/config';

interface FollowButtonProps {
    id: string;
    isFollowing: boolean;
    handleRefresh?: any;
}

const FollowButton: React.FC<FollowButtonProps> = ({ id, isFollowing, handleRefresh }) => {
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
        const response: any = await apiRequest('delete', `${EndPoint.host}/${hostId}/follow`, { userId });
        return response?.status;
    };

    const followApi = async (hostId: string) => {
        const response: any = await apiRequest('post', `${EndPoint.host}/${hostId}/follow`, { userId, hostId, follow: true });
        return response?.status;
    };

    return (
        <ButtonSmall
            style={following ? styles.smallBtnStyle : styles.smallFollowBtnStyle}
            title={loading ? '' : following ? 'Following' : 'Follow'}
            colorTheme={following ? 'dark' : 'dark'}
            leftIcon={following ? IMAGES.check : null}
            borderType={following ? 'STRIPE' : 'SOLID'}
            onPress={handleFollow}
            loading={loading}
            disabled={loading}
        />
    );
};

const styles = StyleSheet.create({
    smallBtnStyle: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    smallFollowBtnStyle: {
        paddingVertical: 6,
        borderRadius: 100,
    },
});

export default FollowButton;