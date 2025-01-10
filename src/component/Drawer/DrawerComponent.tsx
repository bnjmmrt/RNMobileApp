// NewScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DrawerComponent = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text
                style={styles.text}>Drawer Component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    text: {
        fontSize: 24,
        color: '#333',
    },
});

export default DrawerComponent;
