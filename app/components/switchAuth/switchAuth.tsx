import { VStack } from "../ui/vstack";
import { Text } from "react-native";
import { Switch } from "../ui/switch";
import colors from "tailwindcss/colors";
import { ISwitchAuth } from "@/types/switchAuth";

export default function SwitchAuth({isLoginPage, setIsLoginPage, setInputValue, setIsInvalid, setShowPassword, setMessage, isSending}: ISwitchAuth) {
	return (
		<VStack className="w-full items-center gap-2 mt-2">
			<Text className="font-semibold">
				{isLoginPage ? "Go to Sign in" : "Go to Log in"}
			</Text>
			<Switch
				disabled={isSending}
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
					setIsInvalid({
						email: false,
						password: false,
						confirmPassword: false,
					})
					setShowPassword(false);
					setMessage('')
				}}
			/>
		</VStack>
	);
}
