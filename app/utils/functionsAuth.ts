import { IInputValue, IIsInvalid } from "@/types/emailInput";
import React, { SetStateAction } from "react";
import { Router } from "expo-router";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';

export const checkToken = async (router: Router) => {
	if (Platform.OS === 'web') {
		try {
			const token = localStorage.getItem('access_token');
			if (!token) {
				router.replace('/');
			}
		} catch (e) {
			console.error(e);
			router.replace('/');
		}
	} else {
		try {
			const token = await SecureStore.getItemAsync('access_token');
			if (!token) {
				router.replace('/');
			}
		} catch (e) {
			console.error(e);
			router.replace('/');
		}
	}
};

const login = async (email: string, password: string, setMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>, router: Router) => {
	try {

		setIsSending(true);
		const loginData = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});

		const data = await loginData.json();

		if (!loginData.ok) {
			throw new Error(data.message || 'Login failed');
		}

		setMessage(data.message)

		if (Platform.OS === 'web') {
			try {
				if (data.access_token === null) {
					localStorage.removeItem('access_token');
				} else {
					localStorage.setItem('access_token', data.access_token);
				}
			} catch (e) {
				console.error('Local storage is unavailable:', e);
			}
		} else {
			if (data.access_token == null) {
				await SecureStore.deleteItemAsync('access_token');
			} else {
				await SecureStore.setItemAsync('access_token', data.access_token);
			}
		}

		if (!data.firstAccess) {
			router.push({
				pathname: '/first-access/[userId]',
				params: { userId: data.id }
			});
		} else {
			router.push({
				pathname: '/dashboard/[userId]',
				params: { userId: data.id }
			});
		}
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
			body: JSON.stringify({ email, password }),
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

export const handleSubmit = (inputValue: IInputValue, isLoginPage: boolean, setIsInvalid: React.Dispatch<SetStateAction<IIsInvalid>>, setMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>, router: Router) => {
	const emailValid = isValidEmail(inputValue.email);
	const passwordValid = inputValue.password.length >= 6;

	if (isLoginPage) {
		setIsInvalid({
			email: !emailValid,
			password: !passwordValid,
			confirmPassword: false,
		});

		if (!emailValid || !passwordValid) {
			return;
		}

		login(inputValue.email, inputValue.password, setMessage, setIsSending, router);
	} else {
		const passwordsMatch =
			inputValue.password === inputValue.confirmPassword;

		setIsInvalid({
			email: !emailValid,
			password: !passwordValid,
			confirmPassword: !passwordsMatch,
		});

		if (!emailValid || !passwordValid || !passwordsMatch) {
			return;
		}

		signin(inputValue.email, inputValue.confirmPassword, setMessage, setIsSending)
	}
};

export const handleState = (setShowPassword: React.Dispatch<SetStateAction<boolean>>) => {
	setShowPassword((prev: boolean) => !prev);
};
