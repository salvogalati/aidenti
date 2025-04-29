import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Text } from "react-native";
import React, { useEffect } from "react";
import EmailInput from "./components/emailInput/emailInput";
import PasswordInput from "./components/passwordInput/passwordInput";
import ConfirmPasswordInput from "./components/confirmPasswordInput/confirmPasswordInput";
import { handleState, handleSubmit } from "./utils/functionsAuth";
import SwitchAuth from "./components/switchAuth/switchAuth";
import Loader from "./components/loader/loader";
import { Image } from 'expo-image';
import { IndieFlower_400Regular, useFonts } from '@expo-google-fonts/indie-flower';
import Monster from "./components/loader/components/monster";

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
	const [fontsLoaded] = useFonts({
		IndieFlower_400Regular,
	});

	useEffect(() => {
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
		<VStack className="w-full h-full justify-center items-center">
			{loading ? (
				<>
				<Image style={{ width: 320, height: 320 }} source={require('./assets/logo.png')} />
				<Loader />
				</>
			) : (
				<VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4 relative">
					<Monster classMonster={`absolute top-[3px] right-0 max-w-52 max-h-52 gap-2 ${hasErrors ? 'animate-hesitate' : 'animate-walk-and-flip'}`} />
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

					<Button
						className={`w-fit self-end mt-4 ${!canSubmit ? "opacity-50" : ""}`}
						size="sm"
						onPress={() => handleSubmit(inputValue, isLoginPage, setIsInvalid)}
						disabled={!canSubmit}
					>
						<ButtonText>Submit</ButtonText>
					</Button>

					<SwitchAuth
						isLoginPage={isLoginPage}
						setIsLoginPage={setIsLoginPage}
						setInputValue={setInputValue}
						setIsInvalid={setIsInvalid}
						setShowPassword={setShowPassword}
					/>
				</VStack>
			)}
		</VStack>
	);
}
