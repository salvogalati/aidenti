import { IInputValue, IIsInvalid } from "@/types/emailInput";
import React, { SetStateAction } from "react";

const login = async (email: string, password: string) => {
	try {
		const loginData = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ username: email, password }),
		});
	
		if (!loginData.ok) {
			throw new Error('Login failed');
		}
	
		const res = await loginData.json();
		console.log(res);
	} catch (error) {
		console.error('Error during login:', error);
	}
}

export const isValidEmail = (email: string) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const handleSubmit = (inputValue: IInputValue, isLoginPage: boolean, setIsInvalid: React.Dispatch<SetStateAction<IIsInvalid>>) => {
	const emailValid = isValidEmail(inputValue.email);
	const passwordValid = inputValue.password.length >= 6;

	if (isLoginPage) {
		setIsInvalid({
			email: !emailValid,
			password: !passwordValid,
			confirmPassword: false,
		});
		login(inputValue.email, inputValue.password);
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

export const handleState = (setShowPassword: React.Dispatch<SetStateAction<boolean>>) => {
	setShowPassword((prev: boolean) => !prev);
};
