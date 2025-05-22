import { useDispatch, useSelector } from 'react-redux';
import { setRoles } from 'src/redux/slices/authSlice';
import { useGetUserWithRolesByIdMutation } from 'src/redux/actions/inviteGuestsApiAction';
import { RootState } from 'src/redux/slices';

export const useGetRoleByID = () => {
    const dispatch = useDispatch();
    const [getUserById] = useGetUserWithRolesByIdMutation();
    const userId = useSelector((state: RootState) => state.auth.userId);

    const getRoleByID = async () => {
        try {
            const response = await getUserById({ id: userId }).unwrap();
            if (response.success) {
                const { roles } = response.data;

                const transformedRoles = roles.map((role: any) => ({
                    roleName: role.name,
                    roleId: role.id,
                    roleStatus: role.status
                }));
                dispatch(setRoles(transformedRoles));
                return transformedRoles; // <-- return here
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }

    };

    return { getRoleByID };
};
