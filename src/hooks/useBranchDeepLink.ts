import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import branch from 'react-native-branch';
import { ROUTES } from '../navigation/Route';

type RootStackParamList = {
  [ROUTES.UserDetail]: { user: string };
  [ROUTES.EventDetailsScreen]: { eventId: string };
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
    const unsubscribe = branch.subscribe(({ error, params, uri }) => {
      console.log('Branch deep link received:', { error, params, uri });

      if (error) {
        console.log('Error in deep link:', error);
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
        console.log('Extracted path:', path);

        if (path.includes('events/event-details')) {
          const eventId = extractEventIdFromPath(path);
          console.log('Event ID extracted:', eventId);
          if (eventId) {
            console.log('Navigating to event details:', eventId);
            navigation.navigate(ROUTES.EventDetailsScreen, { eventId });
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);
};
