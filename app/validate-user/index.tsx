import { VStack } from "@/components/ui/vstack";
import { View, Image, Text, Keyboard, TouchableWithoutFeedback } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import colors from "tailwindcss/colors";
import Monster from "./components/monster/monster";
import { useLocalSearchParams, useRouter } from "expo-router";
import { verifyOTP } from "./utils/functionsVerifyOTP";

export default function ValidateUser() {
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { email } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [viewOTP, setViewOTP] = useState(true);

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <VStack className="w-full h-full justify-center items-center relative">
      <View className="absolute w-full h-full top-0 left-0">
        <Image blurRadius={5} className="object-cover" style={{ width: '100%', height: '100%' }} source={require('../assets/backgroundLogin.png')} />
      </View>
      <VStack className="w-full gap-2 max-w-[300px] rounded-md border border-background-200 p-4 relative bg-white">
        <Monster classMonster={`absolute -top-24 left-0 max-w-52 max-h-52`} />
        {
          viewOTP &&
          <>
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
          </>
        }
        <VStack className="items-end gap-1">
          {
            message &&
              viewOTP ?
              <Text className="text-end">
                {message}
              </Text>
              :
              message !== '' &&
              <Text className="text-xl text-center mb-3">
                {`${message} 🎉`}
              </Text>
          }
          <Button
            className={`${otp.length !== 6 || isSending ? "opacity-50" : ""}`}
            size="sm"
            disabled={otp.length !== 6 || isSending}
            onPress={() => verifyOTP(email as string, otp, setMessage, setIsSending, router, setViewOTP)}
          >
            {
              isSending &&
              <ButtonSpinner color={colors.gray[400]} />
            }
            <ButtonText>Submit</ButtonText>
          </Button>
        </VStack>
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
