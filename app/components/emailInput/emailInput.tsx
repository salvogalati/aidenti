import { IEmailInput, IInputValue } from "@/types/emailInput";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "../ui/form-control";
import { AlertCircleIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";

export default function EmailInput({isInvalid, inputValue, setInputValue}: IEmailInput) {
	return (
		<FormControl isInvalid={isInvalid.email}>
			<FormControlLabel>
				<FormControlLabelText>Email</FormControlLabelText>
			</FormControlLabel>
			<Input className="my-1">
				<InputField
					type="text"
					placeholder="Email"
					value={inputValue.email}
					onChangeText={(text: string) =>
						setInputValue((prev: IInputValue) => ({
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
	);
}
