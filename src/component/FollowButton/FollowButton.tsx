import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ButtonSmall from '../ButtonSmall';
import IMAGES from '@images/index';
import useApi from 'src/axios/useApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { useUnfollowHostMutation } from 'src/redux/actions/referralApiAction';
import { setRefresh } from 'src/redux/slices/rspvSlice';
import { EndPoint } from 'src/ApiManager/config';

interface FollowButtonProps {
    id: string;
    isFollowing: boolean;
    handleRefresh?: any
}

const FollowButton: React.FC<FollowButtonProps> = ({ id, isFollowing, handleRefresh }) => {
    const [following, setFollowing] = useState(isFollowing);
    useEffect(() => {
        setFollowing(isFollowing)
    }, [isFollowing])
    const userId = useSelector((state: RootState) => state.auth.userId);
    const dispatch = useDispatch();
    const { apiRequest, loading } = useApi();

    const handleFollow = async () => {
        setFollowing(!following);
        const status = await followUnfollow(id, following);
        handleRefresh && dispatch(setRefresh(true))

    };

    const followUnfollow = async (hostId: string, is_following: boolean) => {
        return is_following ? unFollowApi(hostId) : followApi(hostId);
    };

    const unFollowApi = async (hostId: string) => {
        const response: any = await apiRequest('delete', `${EndPoint.host}/${hostId}/follow`, { userId });
        return response?.status;
    };

    const followApi = async (hostId: string) => {
        const response: any = await apiRequest('post', `${EndPoint.host}/${hostId}/follow`, { userId });
        return response?.status;
    };

    return (
        <ButtonSmall
            style={following ? styles.smallBtnStyle : styles.smallFollowBtnStyle}
            title={following ? 'Following' : 'Follow'}
            colorTheme={following ? 'dark' : 'dark'}
            leftIcon={following ? IMAGES.check : null}
            borderType={following ? 'STRIPE' : 'SOLID'}
            onPress={handleFollow}
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FollowButton;
