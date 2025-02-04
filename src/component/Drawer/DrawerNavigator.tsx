import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AccountScreen from '../../screens/AccountScreen/AccountScreen';
import DrawerComponent from './DrawerComponent';
import AnimatedTab from '../BottomTab/AnimatedTab';
import HomeTabs from '../Tabbar/Tabbar';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerComponent {...props} />}
            screenOptions={{
                drawerStyle: {
                    width: 300,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    backgroundColor:'transparent'
                },
                drawerType:'front',
                headerShown: false,
                swipeEnabled: false
            }}
        >
            <Drawer.Screen
                name="HomeTabs"
                component={HomeTabs}
                options={{ headerShown: false }} // Hide the header for Tabs
            />
            <Drawer.Screen name="AccountDrawer" component={AccountScreen} />
        </Drawer.Navigator>
    );
}
