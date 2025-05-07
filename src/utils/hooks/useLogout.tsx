// useLogout.ts
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { InteractionManager } from 'react-native';
import { resetProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { resetAppStack, resetLoginData, setAuthToken } from 'src/redux/slices/authSlice';
import { resetAppFlowDetails } from 'src/redux/slices/appFlowSlice';
import { useMemberLogoutMutation } from 'src/redux/actions/appFlowApiAction';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';

export const useLogout = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [memberLogout, { error, isLoading }] = useMemberLogoutMutation();

    const logOut = async () => {
        try {
            const requestParam = {
                fcmToken: '',
                deviceId: '',
            };
            const response = await memberLogout(requestParam).unwrap();

            if (response.success) {
                dispatch(resetAppStack(false));
                dispatch(resetProfileData());
                dispatch(resetLoginData());
                dispatch(setAuthToken(null));
                dispatch(resetAppFlowDetails());

                InteractionManager.runAfterInteractions(() => {
                    setTimeout(() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'AuthStack' }],
                        });
                    }, 500);
                });

                // FlashMessageComponent.show('success', 'Logout successfully');
            } else {
                FlashMessageComponent.show('error', 'Something went wrong, please try again!');
            }
        } catch (error) {
            FlashMessageComponent.show('error', 'Logout failed');
        }
    };

    return { logOut };
};
