import { Router } from "expo-router";
import IFirstAccess from "../types/firstAccess";
import { SetStateAction } from "react";
import { IAvatar } from "../types/avatar";

export const firstAccess = async (payload: IFirstAccess, router: Router, setErrorMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	try {
		setIsSending(true);
		setErrorMessage('');
		const firstAccessData = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/first-access`, {
			headers: {
				'Content-Type': 'application/json',
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
