import { IInputValue, IIsInvalid } from "@/types/emailInput";
import React, { SetStateAction } from "react";
import { Router } from "expo-router";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEYS } from "@/constans/tokensKeys";

const getToken = async (key: string) => {
	if (Platform.OS === 'web') {
		return localStorage.getItem(key);
	} else {
		return await SecureStore.getItemAsync(key);
	}
};

const setToken = async (key: string, value: string) => {
	if (Platform.OS === 'web') {
		localStorage.setItem(key, value);
	} else {
		await SecureStore.setItemAsync(key, value);
	}
};

export const removeToken = async (key: string) => {
	if (Platform.OS === 'web') {
		localStorage.removeItem(key);
	} else {
		await SecureStore.deleteItemAsync(key);
	}
};

export const checkSession = async (router: Router) => {
	try {
		const token = await getToken(TOKEN_KEYS.access);

		if (!token) {
			throw new Error('Token doesn\'t exist');
		}

		const res = await fetchWithAuth('/fast_login', { method: 'GET' }, router);

		if (!res.ok) {
			throw new Error('Failed to fetch session data');
		}

		const data = await res.json();

		const route = !data.firstAccess
			? '/first-access/[userId]'
			: '/dashboard/[userId]';

		router.push({ pathname: route, params: { userId: data.id } });
	} catch (e) {
		console.error(e);
		router.replace('/');
	}
}

export const checkToken = async (router: Router) => {
	try {
		const token = await getToken(TOKEN_KEYS.access);
		if (!token) {
			console.warn('No access token found. Redirecting to login...');
			router.replace('/');
		}
	} catch (e) {
		console.error('Error while checking access token:', e);
		router.replace('/');
	}
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}, router: Router) => {
	let accessToken = await getToken(TOKEN_KEYS.access);
	let refreshToken = await getToken(TOKEN_KEYS.refresh);

	const headers = {
		...(options.headers || {}),
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};

	let response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${url}`, {
		...options,
		headers,
	});

	if (response.status === 401 && refreshToken) {
		const refreshRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/refresh_token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken }),
		});

		if (refreshRes.ok) {
			const data = await refreshRes.json();

			accessToken = data.access_token;
			refreshToken = data.refresh_token;

			if (accessToken) {
				await setToken(TOKEN_KEYS.access, accessToken);
			}
			if (refreshToken) {
				await setToken(TOKEN_KEYS.refresh, refreshToken);
			}

			const retryHeaders = {
				...headers,
				Authorization: `Bearer ${accessToken}`,
			};

			response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${url}`, {
				...options,
				headers: retryHeaders,
			});
		} else {
			await removeToken(TOKEN_KEYS.access);
			await removeToken(TOKEN_KEYS.refresh);
			console.warn('Refresh token failed. Redirecting to login.');
			router.replace('/');
		}
	}

	return response;
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

		setMessage(data.message);

		if (data.access_token) {
			await setToken(TOKEN_KEYS.access, data.access_token);
		} else {
			await removeToken(TOKEN_KEYS.access);
		}

		if (data.refresh_token) {
			await setToken(TOKEN_KEYS.refresh, data.refresh_token);
		} else {
			await removeToken(TOKEN_KEYS.refresh);
		}

		const route = !data.firstAccess
			? '/first-access/[userId]'
			: '/dashboard/[userId]';

		router.push({ pathname: route, params: { userId: data.id } });
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error during login:', error.message);
			setMessage(error.message);
		} else {
			console.error('Unknown error during login:', error);
		}
	} finally {
		setIsSending(false);
	}
};

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
