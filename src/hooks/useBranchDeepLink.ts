import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import branch from 'react-native-branch';
import { ROUTES } from '../navigation/Route';

interface BranchParams {
  '+clicked_branch_link'?: boolean;
  screen?: string;
  id?: string;
  type?: string;
}

type RootStackParamList = {
  [ROUTES.UserDetail]: { user: string };
  [ROUTES.EventDetailsScreen]: { eventId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useBranchDeepLink = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Subscribe to Branch.io deep link events
    const unsubscribe = branch.subscribe(({ error, params, uri }) => {
      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }

      // Handle the deep link
      if (params && params['+clicked_branch_link']) {
        const { screen, id, type } = params as BranchParams;
        console.log('params', params);

        // Navigate based on the deep link parameters
        if (screen && id) {
          switch (screen) {
            case 'profile':
              navigation.navigate(ROUTES.UserDetail, { user: id });
              break;
            case 'event':
              navigation.navigate(ROUTES.EventDetailsScreen, { eventId: id });
              break;
            // Add more cases as needed
            default:
              console.log('Unknown screen:', screen);
          }
        }
      }
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [navigation]);
};
