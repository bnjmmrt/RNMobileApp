import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { fontFamily, LINKS } from '../../utils/functions';
import { COLORS } from '../../utils/constants';

interface TermsAndPolicyProps {
    setUrl: (url: string) => void;
}

const TermsAndPolicy: React.FC<TermsAndPolicyProps> = ({ setUrl }) => {
    const handleLinkPress = (url: string) => {
        setUrl(url); // Pass URL to parent
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>By clicking 'Next' you agree to our</Text>
            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => handleLinkPress(LINKS.TERMS_AND_CONDITION)}>
                    <Text style={styles.linkText}>Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.text}> and </Text>
                <TouchableOpacity onPress={() => handleLinkPress(LINKS.PRIVACY_POLICY)}>
                    <Text style={styles.linkText}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        color: COLORS.light_gray,
        fontFamily: fontFamily.ABCDiatype_Regular,
        textAlign: 'center',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    linkText: {
        fontSize: 12,
        color: COLORS.black,
        fontFamily: fontFamily.ABCDiatype_Bold,
        textDecorationLine: 'underline',
    },
});

export default TermsAndPolicy;
