import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { VStack } from "../ui/vstack";

interface ITouchableWithoutFeedback {
    children: React.ReactNode;
}

export default function TouchableWithoutFeedbackProvider({ children }: ITouchableWithoutFeedback) {
    if (Platform.OS === "web") {
        return (
            <VStack className="w-full h-full">
                {children}
            </VStack>
        );
    } else {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {children}
            </TouchableWithoutFeedback>
        );
    }
}
