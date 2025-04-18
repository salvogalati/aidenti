import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorText, FormControlErrorIcon, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner"
import { Text } from "react-native";
import React, { useEffect } from "react";
import colors from "tailwindcss/colors"

export default function Login () {
	const [isInvalid, setIsInvalid] = React.useState({email: false, password: false});
	const [showPassword, setShowPassword] = React.useState(false)
    const [inputValue, setInputValue] = React.useState({email: '', password: ''});
	const [loading, setLoading] = React.useState(true);

	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};	

	const handleSubmit = () => {
		const emailValid = isValidEmail(inputValue.email);
		const passwordValid = inputValue.password.length >= 6;

		setIsInvalid({email: !emailValid, password: !passwordValid})
	};

	const handleState = () => {
		setShowPassword((showState) => {
			return !showState
		})
	}

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	}, []);

    return (
		<VStack className="w-full h-full flex justify-center items-center">
			{loading ? (
				<Spinner color={colors.gray[500]} />
			) : (
				<VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
					<Text className="text-[30px] mb-2 font-semibold">
						Log in
					</Text>
					<FormControl isInvalid={isInvalid.email} size="md" isDisabled={false} isReadOnly={false} isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText>Email</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1">
							<InputField
								type="text"
								placeholder="Email"
								value={inputValue.email}
								onChangeText={(text) => setInputValue(prevState => ({...prevState, email: text}))}
							/>
						</Input>
						<FormControlError className={`${isInvalid.email ? 'flex' : 'hidden'} items-center mb-3`}>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText className="text-[10px]">
								Please enter a valid email address.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<FormControl isInvalid={isInvalid.password} size="md" isDisabled={false} isReadOnly={false} isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText>Password</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1">
							<InputField
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								value={inputValue.password}
								onChangeText={(text) => setInputValue((prevState => ({...prevState, password: text})))}
							/>
							<InputSlot className="mr-2" onPress={handleState}>
								<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
							</InputSlot>
						</Input>
						<FormControlError className={`${isInvalid.password ? 'flex' : 'hidden'} items-center`}>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText className="text-[10px]">
								At least 6 characters are required for the password.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<Button className="w-fit self-end mt-4" size="sm" onPress={handleSubmit}>
						<ButtonText>Submit</ButtonText>
					</Button>
				</VStack>
			)}
		</VStack>
	);
};
