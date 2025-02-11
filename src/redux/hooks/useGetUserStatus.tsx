import { useState, useEffect } from 'react';
import { useGetUserStatusQuery } from '../actions/loginApiAction';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../slices';
import { skipToken } from '@reduxjs/toolkit/query';

export const useGetUserStatus = () => {
    const [isLoading, setIsLoading] = useState(false);
    const userId = useSelector((state: RootState) => state.auth.userId);
    const { data, error, isFetching, refetch } = useGetUserStatusQuery(
        userId ? { id: String(userId) } : skipToken
    );
    useEffect(() => {
        if (isFetching) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }

        if (error) {
            // FlashMessageComponent.show('error', 'Something went wrong, please try again!');
            console.error('Error fetching user status:', error);
        }
    }, [isFetching, error]);

    const refetchUserStatus = (onSuccess: (data: any) => void) => {
        refetch().then(({ data }) => {
            if (data) {
                onSuccess(data);
            }
        }).catch((err) => {
            // FlashMessageComponent.show('error', 'Error during refetch');
            console.error('Refetch error:', err);
        });
    };

    return { userStatusData: data, isLoading, refetchUserStatus };
};
