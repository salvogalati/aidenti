import { Router } from "expo-router";
import IFirstAccess from "../types/firstAccess";
import { SetStateAction } from "react";
import { IAvatar } from "../types/avatar";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';

export const firstAccess = async (payload: IFirstAccess, router: Router, setErrorMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	try {
		setIsSending(true);
		setErrorMessage('');

		let token;

		if (Platform.OS === 'web') {
			token = localStorage.getItem('access_token');
		} else {
			token = await SecureStore.getItemAsync('access_token');
		}

		const firstAccessData = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/first-access`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			method: 'POST',
			body: JSON.stringify(payload),
		});

		const data = await firstAccessData.json();

		if (!firstAccessData.ok) {
			throw new Error(data.message);
		}

		router.push({
			pathname: '/dashboard/[userId]',
			params: { userId: data.id }
		});

	} catch (error) {
		if (error instanceof Error) {
			console.error('Error during signin:', error.message);
			setErrorMessage(error.message);
		} else {
			console.error('Unknown error during signin:', error);
		}
		router.replace('/');
	} finally {
		setIsSending(false);
	}
}

export const getAvatars = async (setIsLoading: React.Dispatch<SetStateAction<boolean>>, setAvatars: React.Dispatch<SetStateAction<IAvatar[]>>) => {
	try {
		setIsLoading(true);
		const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/avatar_images`);
		const data = await res.json();
		setAvatars(data);
	} catch (e) {
		console.error(e);
	} finally {
		setIsLoading(false);
	}
}
