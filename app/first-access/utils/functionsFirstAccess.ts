import { Router } from "expo-router";
import IFirstAccess from "../types/firstAccess";
import { SetStateAction } from "react";
import { IAvatar } from "../types/avatar";
import { fetchWithAuth } from "@/utils/functionsAuth";

export const firstAccess = async (payload: IFirstAccess, router: Router, setErrorMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	try {
		setIsSending(true);
		setErrorMessage('');

		const response = await fetchWithAuth('/api/first-access', {
			method: 'POST',
			body: JSON.stringify(payload),
		}, router);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Errore durante il first access');
		}

		router.push({
			pathname: '/dashboard/[userId]',
			params: { userId: data.id },
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error during first access:', error.message);
			setErrorMessage(error.message);
		} else {
			console.error('Unknown error during first access:', error);
		}
		router.replace('/');
	} finally {
		setIsSending(false);
	}
};

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
