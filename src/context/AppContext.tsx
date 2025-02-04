import React, { createContext, ReactNode } from 'react';
import { Dispatch, SetStateAction } from 'react';

// Define the type for your context's value
interface AppContextType {
  // Define the properties your context will have
  isDarkTheme: boolean;
  setIsDarkTheme: Dispatch<SetStateAction<boolean>>;
  themeColors: any;
  someValue: string;
  someFunction: () => void;
}

// Create the context with a default value or undefined (if it's not defined initially)
// export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppContext = createContext<AppContextType | null>(null);
