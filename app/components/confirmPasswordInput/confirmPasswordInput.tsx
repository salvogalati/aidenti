import { IInputValue, IPasswordInput } from "@/types/passwordInput";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "../ui/form-control";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "../ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";

export default function ConfirmPasswordInput({isInvalid, inputValue, setInputValue, showPassword, handleState}: IPasswordInput) {
	return (
		<FormControl isInvalid={isInvalid.confirmPassword}>
			<FormControlLabel>
				<FormControlLabelText>Confirm Password</FormControlLabelText>
			</FormControlLabel>
			<Input className="my-1">
				<InputField
					type={showPassword ? "text" : "password"}
					placeholder="Confirm Password"
					value={inputValue.confirmPassword}
					onChangeText={(text: string) =>
						setInputValue((prev: IInputValue) => ({
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
	);
}
