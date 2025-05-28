import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { logout } from "./utils/functionsSettings";

export default function Settings() {
    const router = useRouter();

    return (
        <View className="w-full h-full flex gap-2 justify-center items-center">
            <Button onPress={() => logout(router)}>
                <ButtonText>
                    Log out
                </ButtonText>
            </Button>
            <Button onPress={() => router.back()}>
                <ButtonIcon as={ArrowLeftIcon} />
                <ButtonText>
                    Go dashboard
                </ButtonText>
            </Button>
        </View>
    );
}
