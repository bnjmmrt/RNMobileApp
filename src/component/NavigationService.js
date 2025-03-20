import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function navigateToNestedStack(stackName, screenName, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(stackName, {
      screen: screenName,
      params: params,
    });
  }
}
