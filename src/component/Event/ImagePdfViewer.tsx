import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Linking,
    Alert,
    Pressable,
} from "react-native";
import IMAGES from "@images/index";
import { BUTTON_LABLE, COLORS } from "src/utils/constants";
import FastImage from "@d11/react-native-fast-image";
import { verticalMarginScale, verticalScale } from "src/utils/dimensions";
import Button from "../Button";

interface MediaItem {
    type: "image" | "pdf";
    uri?: string;
    name?: string;
    size?: string;
}

interface ImagePdfViewerProps {
    visible: boolean;
    onClose: () => void;
    mediaItems: MediaItem[];
}

const { width, height } = Dimensions.get("window");

const ImagePdfViewer: React.FC<ImagePdfViewerProps> = ({
    visible,
    onClose,
    mediaItems,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < mediaItems.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const openPdfInBrowser = async (pdfUrl: string) => {
        try {
            const supported = await Linking.canOpenURL(pdfUrl);
            if (supported) {
                await Linking.openURL(pdfUrl);
            } else {
                Alert.alert("Error", "Cannot open this PDF link.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong while opening the PDF.");
        }
    };

    const renderMedia = () => {
        const currentItem = mediaItems[currentIndex];
        if (currentItem.type === "image") {
            return <FastImage source={{ uri: currentItem.uri }} style={styles.media} resizeMode='contain' />;
        } else if (currentItem.type === "pdf") {
            return (
                <Pressable style={styles.pdfContainer} onPress={() => openPdfInBrowser(currentItem.uri!)}>
                    <Image source={IMAGES.arrowRight} style={styles.pdfIcon} resizeMode='contain' />
                    <Text style={styles.pdfText}>{currentItem.name}</Text>
                    <Text style={styles.pdfSize}>{currentItem.size}</Text>
                </Pressable>
            );
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalBackground}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Image source={IMAGES.cross} />
                    </TouchableOpacity>
                    <Text style={styles.mediaInfo}>{currentIndex + 1} of {mediaItems.length}</Text>
                </View>

                <View style={styles.mediaContainer}>{renderMedia()}</View>

                {mediaItems.length > 1 && (
                    <>
                        {currentIndex > 0 && (
                            <TouchableOpacity style={styles.leftButton} onPress={handlePrev}>
                                <Image source={IMAGES.leftArrow} style={styles.arrowIcon} resizeMode='center' />
                            </TouchableOpacity>
                        )}
                        {currentIndex < mediaItems.length - 1 && (
                            <TouchableOpacity style={styles.rightButton} onPress={handleNext}>
                                <Image source={IMAGES.arrowRight} style={styles.arrowIcon} resizeMode='center' />
                            </TouchableOpacity>
                        )}
                    </>
                )}

                <View style={styles.footer}>
                    <Button
                        disabled={false}
                        style={styles.btnStyle}
                        title={BUTTON_LABLE.SAVE_TO_FILE}
                        colorTheme="light"
                        onPress={handleNext}
                    />

                    <Button
                        disabled={false}
                        style={styles.btnStyle}
                        title={BUTTON_LABLE.SAVE_TO_FILE}
                        colorTheme="light"
                        onPress={handleNext}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default ImagePdfViewer;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        top: 40,
        zIndex: 2,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    closeButton: {
        width: verticalScale(40),
        height: verticalScale(40),
        borderRadius: 20,
        backgroundColor: COLORS.white, // Light gray background
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalMarginScale(20),
        position: 'absolute',
        top: 10,
        left: 10
    },
    icon: {
        width: 10,
        height: 10,
    },
    mediaInfo: {
        color: "white",
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        flex: 1,
    },
    mediaContainer: {
        width: width * 0.9,
        height: height * 0.7,
        justifyContent: "center",
        alignItems: "center",
    },
    media: {
        width: "100%",
        height: "100%",
    },
    pdfContainer: {
        width: width * 0.8,
        height: height * 0.5,
        backgroundColor: "#222",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    pdfIcon: {
        width: 30,
        height: 30,
        marginBottom: 10,
    },
    pdfText: {
        color: "white",
        fontSize: 16,
        marginTop: 10,
    },
    pdfSize: {
        color: "gray",
        fontSize: 14,
        marginTop: 5,
    },
    leftButton: {
        position: "absolute",
        left: 10,
        top: "50%",
        backgroundColor: COLORS.white,
        borderRadius: 40,
        transform: [{ translateY: -20 }],
    },
    rightButton: {
        position: "absolute",
        right: 10,
        top: "50%",
        backgroundColor: COLORS.white,
        borderRadius: 40,
        transform: [{ translateY: -20 }],
    },
    arrowIcon: {
        width: 40,
        height: 40,
    },
    footer: {
        position: "absolute",
        bottom: 40,
        gap: 10,
        alignItems: "center",
    },
    btnStyle: {
        borderRadius: 100,
    },
});
