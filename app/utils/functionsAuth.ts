import { IInputValue, IIsInvalid } from "@/types/emailInput";
import React, { SetStateAction } from "react";

const login = async (email: string, password: string, setMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	try {

		setIsSending(true);
		const loginData = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({email, password}),
		});

		const data = await loginData.json();
	
		if (!loginData.ok) {
			throw new Error(data.message || 'Login failed');
		}
		setMessage(data.message)
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error during login:', error.message);
			setMessage(error.message)
		} else {
			console.error('Unknown error during login:', error);
		}
	} finally {
		setIsSending(false);
	}
}

const signin = async (email: string, password: string, setMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	try {

		setIsSending(true);
		const signinData = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({email, password}),
		});

		const data = await signinData.json();
	
		if (!signinData.ok) {
			throw new Error(data.message || 'Signin failed');
		}

		setMessage(data.message)

	} catch (error) {
		if (error instanceof Error) {
			console.error('Error during signin:', error.message);
			setMessage(error.message)
		} else {
			console.error('Unknown error during signin:', error);
		}
	} finally {
		setIsSending(false);
	}
}

export const isValidEmail = (email: string) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const handleSubmit = (inputValue: IInputValue, isLoginPage: boolean, setIsInvalid: React.Dispatch<SetStateAction<IIsInvalid>>, setMessage:React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	const emailValid = isValidEmail(inputValue.email);
	const passwordValid = inputValue.password.length >= 6;

	if (isLoginPage) {
		setIsInvalid({
			email: !emailValid,
			password: !passwordValid,
			confirmPassword: false,
		});
		login(inputValue.email, inputValue.password, setMessage, setIsSending);
	} else {
		const passwordsMatch =
			inputValue.password === inputValue.confirmPassword;

		setIsInvalid({
			email: !emailValid,
			password: !passwordValid,
			confirmPassword: !passwordsMatch,
		});
		signin(inputValue.email, inputValue.confirmPassword, setMessage, setIsSending)
	}
};

export const handleState = (setShowPassword: React.Dispatch<SetStateAction<boolean>>) => {
	setShowPassword((prev: boolean) => !prev);
};
