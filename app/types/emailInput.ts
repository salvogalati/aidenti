import React, { SetStateAction } from "react";

export interface IIsInvalid {
	email: boolean;
	password: boolean;
	confirmPassword: boolean;
}

export interface IInputValue {
	email: string;
	password: string;
	confirmPassword: string;
}

export interface IEmailInput {
	isInvalid: IIsInvalid;
	inputValue: IInputValue;
	setInputValue: React.Dispatch<SetStateAction<IInputValue>>
}
