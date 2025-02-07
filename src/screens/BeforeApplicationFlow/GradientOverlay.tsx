import React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Hp, Wp } from "src/utils/dimensions";

const GradientOverlay = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[
                    "rgba(40, 176, 228, 0.1)",
                    "rgba(100, 209, 200, 0.01)",
                    "rgba(251, 161, 186, 0.09)",
                    "rgba(85, 24, 41, 0.07)",
                    "rgba(168, 119, 180, 0.07)",
                ]}
                locations={[0, 0.2645, 0.42, 0.788, 1]}
                start={{ x: 0.15, y: 0 }}
                end={{ x: 0.85, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Wp("100%"),
        height: Hp("100%"),
        position: "absolute",
    },
});

export default GradientOverlay;
