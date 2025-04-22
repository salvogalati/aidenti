import { Button, ButtonText } from "@/components/ui/button";
import {
	FormControl,
	FormControlError,
	FormControlErrorText,
	FormControlErrorIcon,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import {
	Input,
	InputField,
	InputIcon,
	InputSlot,
} from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import {
	AlertCircleIcon,
	EyeIcon,
	EyeOffIcon,
} from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "react-native";
import React, { useEffect } from "react";
import colors from "tailwindcss/colors";
import { Switch } from "./components/ui/switch";

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

	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleSubmit = () => {
		const emailValid = isValidEmail(inputValue.email);
		const passwordValid = inputValue.password.length >= 6;

		if (isLoginPage) {
			setIsInvalid({
				email: !emailValid,
				password: !passwordValid,
				confirmPassword: false,
			});
		} else {
			const passwordsMatch =
				inputValue.password === inputValue.confirmPassword;

			setIsInvalid({
				email: !emailValid,
				password: !passwordValid,
				confirmPassword: !passwordsMatch,
			});
		}
	};

	const handleState = () => {
		setShowPassword((prev) => !prev);
	};

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

	return (
		<VStack className="w-full h-full justify-center items-center">
			{loading ? (
				<Spinner color={colors.gray[500]} />
			) : (
				<VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
					<Text className="text-[30px] mb-2 font-semibold">
						{isLoginPage ? "Log in" : "Sign in"}
					</Text>

					<FormControl isInvalid={isInvalid.email}>
						<FormControlLabel>
							<FormControlLabelText>Email</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1">
							<InputField
								type="text"
								placeholder="Email"
								value={inputValue.email}
								onChangeText={(text) =>
									setInputValue((prev) => ({
										...prev,
										email: text,
									}))
								}
							/>
						</Input>
						<FormControlError className={`${isInvalid.email ? "flex" : "hidden"} items-center mb-3`}>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText className="text-[10px]">
								Please enter a valid email address.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>

					<FormControl isInvalid={isInvalid.password}>
						<FormControlLabel>
							<FormControlLabelText>Password</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1">
							<InputField
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								value={inputValue.password}
								onChangeText={(text) =>
									setInputValue((prev) => ({
										...prev,
										password: text,
									}))
								}
							/>
							<InputSlot className="mr-2" onPress={handleState}>
								<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
							</InputSlot>
						</Input>
						<FormControlError className={`${isInvalid.password ? "flex" : "hidden"} items-center`}>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText className="text-[10px]">
								At least 6 characters are required for the password.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>

					{!isLoginPage && (
						<FormControl isInvalid={isInvalid.confirmPassword}>
							<FormControlLabel>
								<FormControlLabelText>Confirm Password</FormControlLabelText>
							</FormControlLabel>
							<Input className="my-1">
								<InputField
									type={showPassword ? "text" : "password"}
									placeholder="Confirm Password"
									value={inputValue.confirmPassword}
									onChangeText={(text) =>
										setInputValue((prev) => ({
											...prev,
											confirmPassword: text,
										}))
									}
								/>
								<InputSlot className="mr-2" onPress={handleState}>
									<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
								</InputSlot>
							</Input>
							<FormControlError className={`${isInvalid.confirmPassword ? "flex" : "hidden"} items-center`}>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText className="text-[10px]">
									Passwords must match.
								</FormControlErrorText>
							</FormControlError>
						</FormControl>
					)}

					<Button
						className={`w-fit self-end mt-4 ${!canSubmit ? "opacity-50" : ""}`}
						size="sm"
						onPress={handleSubmit}
						disabled={!canSubmit}
					>
						<ButtonText>Submit</ButtonText>
					</Button>

					<VStack className="w-full items-center gap-2 mt-2">
						<Text className="font-semibold">
							{isLoginPage ? "Go to Sign in" : "Go to Log in"}
						</Text>
						<Switch
							value={isLoginPage}
							trackColor={{ false: colors.gray[300], true: colors.gray[500] }}
							thumbColor={colors.gray[50]}
							activeThumbColor={colors.gray[50]}
							ios_backgroundColor={colors.gray[300]}
							onToggle={() => {
								setIsLoginPage(!isLoginPage);
								setInputValue({
									email: "",
									password: "",
									confirmPassword: "",
								});
							}}
						/>
					</VStack>
				</VStack>
			)}
		</VStack>
	);
}
