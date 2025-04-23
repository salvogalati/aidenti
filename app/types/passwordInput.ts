import React, { SetStateAction } from "react";

interface IIsInvalid {
	email: boolean;
	password: boolean;
	confirmPassword: boolean;
}

export interface IInputValue {
	email: string;
	password: string;
	confirmPassword: string;
}

export interface IPasswordInput {
	isInvalid: IIsInvalid;
	inputValue: IInputValue;
	setInputValue: React.Dispatch<SetStateAction<IInputValue>>
	showPassword: boolean;
	handleState: () => void;
}
