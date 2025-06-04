import { Router } from "expo-router";
import IFirstAccess from "../types/firstAccess";
import { SetStateAction } from "react";
import { IAvatar } from "../types/avatar";
import { fetchWithAuth } from "@/utils/functionsAuth";

export const firstAccess = async (payload: IFirstAccess, router: Router, setMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	try {
		setIsSending(true);
		setMessage('');

		const response = await fetchWithAuth('/api/first-access', {
			method: 'POST',
			body: JSON.stringify(payload),
		}, router);

		const data = await response.json();

		if (!response.ok || !data.id) {
			throw new Error(data.message || 'Error during first access');
		}

		router.push({
			pathname: '/dashboard/[userId]',
			params: { userId: data.id },
		});
	} catch (error) {
		console.error('Error during first access:', error);
		setMessage(error instanceof Error ? error.message : 'Unknown error');
	} finally {
		setIsSending(false);
	}
};

export const getAvatars = async (setIsLoading: React.Dispatch<SetStateAction<boolean>>, setAvatars: React.Dispatch<SetStateAction<IAvatar[]>>) => {
	try {
		setIsLoading(true);
		const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/avatar_images`);
		if (!res.ok) {
			throw new Error('Failed to fetch avatars');
		}
		const data = await res.json();
		setAvatars(data);
	} catch (e) {
		console.error('Error fetching avatars:', e);
		setAvatars([]);
	} finally {
		setIsLoading(false);
	}
}
