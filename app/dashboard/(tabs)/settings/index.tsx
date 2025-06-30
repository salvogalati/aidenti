import { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
import { Platform, View } from "react-native";
import { logout, updateUserData } from "./utils/functionsSettings";
import { VStack } from "@/components/ui/vstack";
import { useContext, useEffect, useState } from "react";
import Username from "@/first-access/components/username/username";
import Avatars from "@/first-access/components/avatars/avatars";
import colors from "tailwindcss/colors";
import { UserContext } from "@/dashboard/context/UserContext";
import { Text } from "react-native";
import TouchableWithoutFeedbackProvider from "@/components/touchableWithoutFeedback/touchableWithoutFeedback";

export default function Settings() {
    const router = useRouter();
    const [isWeb, setIsWeb] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [payload, setPayload] = useState({ id: '', username: '', date_of_birth: '', gender: '', avatar_id: '' });
    const { user, setUser } = useContext(UserContext);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (Platform.OS === 'web') {
            setIsWeb(true);
        }
    }, [])

    useEffect(() => {
        if (user) {
            setPayload((prevState => ({ ...prevState, id: user.id, username: user.username, avatar_id: user.avatar_src })))
        }
    }, [user])

    return (
        <TouchableWithoutFeedbackProvider>
            <View className="w-full h-full flex justify-center items-center">
                <VStack className="w-full max-w-[300px] items-start gap-3 p-4 border">
                    {
                        isWeb &&
                        <Button onPress={() => router.back()}>
                            <ButtonIcon as={ArrowLeftIcon} />
                            <ButtonText>
                                Go dashboard
                            </ButtonText>
                        </Button>
                    }
                    <Username payload={payload} setPayload={setPayload} />
                    {
                        message &&
                        <Text>
                            {message}
                        </Text>
                    }
                    <Avatars payload={payload} setPayload={setPayload} isFirstAccessPage={false} />
                    <ButtonGroup className="w-full">
                        <Button
                            disabled={isSending}
                            className={`${isSending ? 'opacity-50' : ''}`}
                            onPress={() => updateUserData({ id: payload.id, avatar_src: payload.avatar_id, username: payload.username }, setUser, router, setMessage, setIsSending)}
                        >
                            {
                                isSending &&
                                <ButtonSpinner color={colors.gray[400]} />
                            }
                            <ButtonText>
                                Send
                            </ButtonText>
                        </Button>
                    </ButtonGroup>
                    <Button className="mt-5 w-full" action="negative" onPress={() => logout(router)}>
                        <ButtonText>
                            Log out
                        </ButtonText>
                    </Button>
                </VStack>
            </View>
        </TouchableWithoutFeedbackProvider>
    );
}
