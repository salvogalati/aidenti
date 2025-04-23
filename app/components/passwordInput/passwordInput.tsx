import { IInputValue, IPasswordInput } from "@/types/passwordInput";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "../ui/form-control";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "../ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";

export default function PasswordInput({isInvalid, inputValue, setInputValue, showPassword, handleState}: IPasswordInput) {
	return (
		<FormControl isInvalid={isInvalid.password}>
			<FormControlLabel>
				<FormControlLabelText>Password</FormControlLabelText>
			</FormControlLabel>
			<Input className="my-1">
				<InputField
					type={showPassword ? "text" : "password"}
					placeholder="Password"
					value={inputValue.password}
					onChangeText={(text: string) =>
						setInputValue((prev: IInputValue) => ({
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
	);
}
