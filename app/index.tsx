import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Text, View } from "react-native";
import React, { useEffect } from "react";
import EmailInput from "./components/emailInput/emailInput";
import PasswordInput from "./components/passwordInput/passwordInput";
import ConfirmPasswordInput from "./components/confirmPasswordInput/confirmPasswordInput";
import { checkSession, handleState, handleSubmit } from "./utils/functionsAuth";
import SwitchAuth from "./components/switchAuth/switchAuth";
import Loader from "./components/loader/loader";
import { Image } from 'expo-image';
import { IndieFlower_400Regular, useFonts } from '@expo-google-fonts/indie-flower';
import Monster from "./components/monster/monster";
import colors from "tailwindcss/colors";
import { Link, useRouter } from "expo-router";
import { Box } from "./components/ui/box";
import TouchableWithoutFeedbackProvider from "./components/touchableWithoutFeedback/touchableWithoutFeedback";

export default function Auth() {
	const [inputValue, setInputValue] = React.useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [isInvalid, setIsInvalid] = React.useState({
		email: false,
		password: false,
		confirmPassword: false,
	});
	const [showPassword, setShowPassword] = React.useState(false);
	const [isLoginPage, setIsLoginPage] = React.useState(true);
	const [loading, setLoading] = React.useState(true);
	const [isSending, setIsSending] = React.useState(false);
	const [message, setMessage] = React.useState('');
	const [fontsLoaded] = useFonts({
		IndieFlower_400Regular,
	});

	const router = useRouter();

	useEffect(() => {
		checkSession(router);
		const timer = setTimeout(() => {
			setLoading(false);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	const canSubmit =
		isLoginPage
			? inputValue.email.trim().length > 0 && inputValue.password.trim().length > 0
			: inputValue.email.trim().length > 0 &&
			inputValue.password.trim().length > 0 &&
			inputValue.confirmPassword.trim().length > 0;

	const hasErrors = Object.values(isInvalid).some(Boolean);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<TouchableWithoutFeedbackProvider>
			<VStack className="w-full h-full justify-center items-center relative">
				{loading ? (
					<>
						<Image style={{ width: 320, height: 320 }} source={require('./assets/logoApp.png')} />
						<Loader />
					</>
				) : (
					<>
						<View className="absolute w-full h-full top-0 left-0">
							<Image blurRadius={5} className="object-cover" style={{ width: '100%', height: '100%' }} source={require('./assets/backgroundLogin.png')} />
						</View>
						<VStack className='w-full max-w-[300px]'>
							<SwitchAuth
								isLoginPage={isLoginPage}
								setIsLoginPage={setIsLoginPage}
								setInputValue={setInputValue}
								setIsInvalid={setIsInvalid}
								setShowPassword={setShowPassword}
								setMessage={setMessage}
								isSending={isSending}
							/>

							<VStack className="w-full rounded-bl-md rounded-br-md border border-background-200 p-4 relative bg-white">
								<Monster classMonster={`absolute top-3 right-0 max-w-52 max-h-52 ${hasErrors ? 'animate-hesitate' : 'animate-walk-and-flip'}`} />
								<Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-[30px] mb-2 font-semibold">
									{isLoginPage ? "Log in" : "Sign in"}
								</Text>

								<EmailInput
									isInvalid={isInvalid}
									inputValue={inputValue}
									setInputValue={setInputValue}
								/>

								<PasswordInput
									isInvalid={isInvalid}
									inputValue={inputValue}
									setInputValue={setInputValue}
									showPassword={showPassword}
									handleState={() => handleState(setShowPassword)}
								/>

								{!isLoginPage && (
									<ConfirmPasswordInput
										isInvalid={isInvalid}
										inputValue={inputValue}
										setInputValue={setInputValue}
										showPassword={showPassword}
										handleState={() => handleState(setShowPassword)}
									/>
								)}

								{
									isLoginPage &&
									<Box className="mt-1">
										<Link href="/forgot-password" className="underline">
											Forgot password?
										</Link>
									</Box>
								}

								{
									message &&
									<Text className="text-end mt-2">
										{message}
									</Text>
								}

								<Button
									className={`w-fit self-end mt-4 ${!canSubmit || isSending ? "opacity-50" : ""}`}
									size="sm"
									onPress={() => handleSubmit(inputValue, isLoginPage, setIsInvalid, setMessage, setIsSending, router)}
									disabled={!canSubmit || isSending}
								>
									{
										isSending &&
										<ButtonSpinner color={colors.gray[400]} />
									}
									<ButtonText>Submit</ButtonText>
								</Button>
							</VStack>
						</VStack>
					</>
				)}
			</VStack>
		</TouchableWithoutFeedbackProvider>
	);
}
