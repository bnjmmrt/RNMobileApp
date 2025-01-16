import { showMessage } from "react-native-flash-message";

type MessageType = "success" | "error" | "info" | "warning";

export const FlashMessageComponent = {
    show: (type: MessageType, message: string) => {
        let backgroundColor: string;

        switch (type) {
            case "success":
                backgroundColor = "#1F1F1F";
                break;
            case "error":
                backgroundColor = "#EE6055";
                break;
            case "info":
                backgroundColor = "#2196F3";
                break;
            case "warning":
                backgroundColor = "#FFC107";
                break;
            default:
                backgroundColor = "#000";
        }

        showMessage({
            message,
            type: "default",
            backgroundColor,
            color: "#fff",
        });
    },
};
