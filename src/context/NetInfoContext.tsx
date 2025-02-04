import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetInfoContextType {
  isInternetConnected: boolean;
}

const NetInfoContext = createContext<NetInfoContextType | undefined>(undefined);

export const NetInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInternetConnected, setIsInternetConnected] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the initial connection state
    const fetchInitialState = async () => {
      try {
        const initialState: NetInfoState = await NetInfo.fetch();
        console.log('Initial network state:', initialState.isConnected);
        setIsInternetConnected(initialState.isConnected ?? false);
      } catch (error) {
        console.error('Error fetching initial network state:', error);
      }
    };

    fetchInitialState();

    // Subscribe to connection state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('Network state change detected:', state.isConnected);
      setIsInternetConnected(state.isConnected ?? false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  console.log('isInternetConnected:', isInternetConnected);

  return (
    <NetInfoContext.Provider value={{ isInternetConnected }}>
      {children}
    </NetInfoContext.Provider>
  );
};

export const useAuth = (): NetInfoContextType => {
  const context = useContext(NetInfoContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a NetInfoProvider');
  }
  return context;
};
