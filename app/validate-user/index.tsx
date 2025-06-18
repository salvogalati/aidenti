import { VStack } from "@/components/ui/vstack";
import { View, Image, Text, Keyboard, TouchableWithoutFeedback } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import colors from "tailwindcss/colors";
import Monster from "./components/monster/monster";
import { HStack } from "@/components/ui/hstack";

export default function ValidateUser() {
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
    
	return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <VStack className="w-full h-full justify-center items-center relative">
            <View className="absolute w-full h-full top-0 left-0">
                <Image blurRadius={5} className="object-cover" style={{ width: '100%', height: '100%' }} source={require('../assets/backgroundLogin.png')} />
            </View>
            <VStack className="w-full gap-2 max-w-[300px] rounded-md border border-background-200 p-4 relative bg-white">
                <Monster classMonster={`absolute -top-24 left-0 max-w-52 max-h-52`} />
                <Text>
                  OTP sent via email
                </Text>
                <OtpInput
                    numberOfDigits={6}
                    focusColor={'white'}
                    hideStick={false}
                    placeholder="       "
                    blurOnFilled={true}
                    disabled={false}
                    type="numeric"
                    secureTextEntry={false}
                    focusStickBlinkingDuration={500}
                    onTextChange={(text) => {
                        setOtp(text);
                    }}
                    textInputProps={{
                        accessibilityLabel: "One-Time Password",
                    }}
                    textProps={{
                        accessibilityRole: "text",
                        accessibilityLabel: "OTP digit",
                        allowFontScaling: false,
                    }}
                    theme={{
                        containerStyle: styles.container,
                        pinCodeContainerStyle: styles.pinCodeContainer,
                        pinCodeTextStyle: styles.pinCodeText,
                        focusStickStyle: styles.focusStick,
                        filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                    }}
                />
                <HStack className="justify-end">
                  <Button
                    className={`${otp.length !== 6 || isSending ? "opacity-50" : ""}`}
                    size="sm"
                    disabled={otp.length !== 6 || isSending}
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
      </TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '5px'
  },
  pinCodeContainer: {
    width: 40,
    borderWidth: 2,
    borderColor: 'black'
  },
  filledPinCodeContainer: {
    backgroundColor: "white",
  },
  pinCodeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  focusStick: {
    width: 2,
    height: 20,
    backgroundColor: "black",
  },
});
