import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import ButtonSmall from '../ButtonSmall';
import IMAGES from '@images/index';
import useApi from 'src/axios/useApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { useUnfollowHostMutation } from 'src/redux/actions/referralApiAction';

interface FollowButtonProps {
    id: string;
    isFollowing: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ id, isFollowing }) => {
    const [following, setFollowing] = useState(isFollowing);
    const userId = useSelector((state: RootState) => state.auth.userId);
    const { apiRequest, loading } = useApi();

    const handleFollow = async () => {
        const status = await followUnfollow(id, following);
        setFollowing(!following);

    };

    const followUnfollow = async (hostId: string, is_following: boolean) => {
        return is_following ? unFollowApi(hostId) : followApi(hostId);
    };

    const unFollowApi = async (hostId: string) => {
        const response: any = await apiRequest('delete', `v1/auth/host/${hostId}/follow`, { userId });
        return response?.status;
    };

    const followApi = async (hostId: string) => {
        const response: any = await apiRequest('post', `v1/auth/host/${hostId}/follow`, { userId });
        return response?.status;
    };

    return (
        <ButtonSmall
            style={styles.smallBtnStyle}
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FollowButton;
