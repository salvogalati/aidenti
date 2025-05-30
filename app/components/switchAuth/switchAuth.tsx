import { ISwitchAuth } from "@/types/switchAuth";
import { HStack } from "../ui/hstack";
import { Button, ButtonText } from "../ui/button";

export default function SwitchAuth({ isLoginPage, setIsLoginPage, setInputValue, setIsInvalid, setShowPassword, setMessage, isSending }: ISwitchAuth) {
	return (
		<HStack className="w-full justify-center">
			<HStack className="w-full justify-center">
				<Button
					action={isLoginPage ? 'switchActive' : 'switchDeactive'}
					disabled={isLoginPage || isSending}
					className={`w-1/2 rounded-tr-none rounded-br-none rounded-bl-none`}
					onPress={() => {
						setIsLoginPage(!isLoginPage);
						setInputValue({
							email: "",
							password: "",
							confirmPassword: "",
						});
						setIsInvalid({
							email: false,
							password: false,
							confirmPassword: false,
						})
						setShowPassword(false);
						setMessage('')
					}}
				>
					<ButtonText>Log in</ButtonText>
				</Button>
				<Button
					action={!isLoginPage ? 'switchActive' : 'switchDeactive'}
					disabled={!isLoginPage || isSending}
					className={`w-1/2 rounded-tl-none rounded-bl-none rounded-br-none`}
					onPress={() => {
						setIsLoginPage(!isLoginPage);
						setInputValue({
							email: "",
							password: "",
							confirmPassword: "",
						});
						setIsInvalid({
							email: false,
							password: false,
							confirmPassword: false,
						})
						setShowPassword(false);
						setMessage('')
					}}
				>
					<ButtonText>Sign in</ButtonText>
				</Button>
			</HStack>
		</HStack>
	);
}
