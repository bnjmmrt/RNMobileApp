import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import branch from 'react-native-branch';
import { ROUTES } from '../navigation/Route';

type RootStackParamList = {
  [ROUTES.UserDetail]: { user: string };
  [ROUTES.EventStack]: {
    screen: typeof ROUTES.EventDetailsScreen;
    params: { id: string };
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useBranchDeepLink = () => {
  const navigation = useNavigation<NavigationProp>();

  const extractEventIdFromPath = (path: string): string | null => {
    const queryStart = path.indexOf('?');
    if (queryStart !== -1) {
      const queryString = path.substring(queryStart + 1);
      const params = queryString.split('&');
      for (const param of params) {
        const [key, value] = param.split('=');
        if (key === 'id' && value) {
          return decodeURIComponent(value);
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = branch.subscribe(({ error, uri }) => {
      if (error) {
        return;
      }

      // Handle both clicked and non-clicked branch links
      if (uri) {
        let path = '';
        if (uri.includes('://')) {
          path = uri.split('://')[1] || '';
        } else {
          path = uri;
        }

        if (path.includes('events/event-details')) {
          const eventId = extractEventIdFromPath(path);
          if (eventId) {
            navigation.navigate(ROUTES.EventStack, {
              screen: ROUTES.EventDetailsScreen,
              params: { id: eventId },
            });
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);
};
