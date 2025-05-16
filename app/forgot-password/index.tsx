import { VStack } from "@/components/ui/vstack";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { useState } from "react";
import { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText } from "@/components/ui/button";
import colors from "tailwindcss/colors";
import { isValidEmail } from "@/utils/functionsAuth";
import { HStack } from "@/components/ui/hstack";
import { useRouter } from "expo-router";
import { forgotPassword } from "./utils/functionsForgotPassword";
import Monster from "./components/monster/monster";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState('');

    const router = useRouter();

    const canSubmit = email.trim().length > 0 && isValidEmail(email);

    return (
        <VStack className="w-full h-full justify-center items-center relative">
            <View className="absolute w-full h-full top-0 left-0">
                <Image blurRadius={5} className="object-cover" style={{ width: '100%', height: '100%' }} source={require('../assets/backgroundLogin.png')} />
            </View>
            <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4 relative bg-white">
                <Monster classMonster={`absolute -top-24 left-0 max-w-52 max-h-52`} />
                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Insert your email</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1">
                        <InputField
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </Input>
                </FormControl>
                {
                    message &&
                    <Text className="text-end mt-2">
                        {message}
                    </Text>
                }
                <HStack className="w-full justify-end gap-2 mt-4">
                    <ButtonGroup>
                        <Button size="sm" onPress={() => router.back()}>
                            <ButtonIcon as={ArrowLeftIcon} />
                            <ButtonText>
                                Go Back
                            </ButtonText>

                        </Button>
                    </ButtonGroup>
                    <Button
                        className={`${!canSubmit || isSending ? "opacity-50" : ""}`}
                        size="sm"
                        disabled={!canSubmit || isSending}
                        onPress={() => forgotPassword(email, setMessage, setIsSending)}
                    >
                        {
                            isSending &&
                            <ButtonSpinner color={colors.gray[400]} />
                        }
                        <ButtonText>Submit</ButtonText>
                    </Button>
                </HStack>
            </VStack>
        </VStack>
    );
}
