import { useState, useEffect } from 'react';
import { useGetUserStatusQuery } from '../actions/loginApiAction';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';

export const useGetUserStatus = (email?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    console.log("Sayyed api called param:", email)
    const { data, error, isFetching, refetch } = useGetUserStatusQuery({ email });

    useEffect(() => {
        if (isFetching) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }

        if (error) {
            FlashMessageComponent.show('error', 'Something went wrong, please try again!');
            console.error('Error fetching user status:', error);
        }
    }, [isFetching, error]);

    const refetchUserStatus = (onSuccess: (data: any) => void) => {
        refetch().then(({ data }) => {
            if (data) {
                onSuccess(data);
            }
        }).catch((err) => {
            FlashMessageComponent.show('error', 'Error during refetch');
            console.error('Refetch error:', err);
        });
    };

    return { userStatusData: data, isLoading, refetchUserStatus };
};
