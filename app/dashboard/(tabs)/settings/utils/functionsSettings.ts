import { TOKEN_KEYS } from "@/constans/tokensKeys";
import { fetchWithAuth, removeToken } from "@/utils/functionsAuth";
import { Router } from "expo-router";
import IUpdateUserData from "../types/updateUserData";
import { SetStateAction } from "react";
import { IUser } from "@/dashboard/context/types/user";

export const logout = async (router: Router) => {
	try {
		const res = await fetchWithAuth('/logout', { method: 'GET' }, router);

		if (!res.ok) {
			throw new Error('Error during logout, please retry!');
		}
	} catch (e) {
		console.error('Logout error:', e);
	} finally {
		await removeToken(TOKEN_KEYS.access);
		await removeToken(TOKEN_KEYS.refresh);
		router.replace('/');
	}
};

export const updateUserData = async (payload: IUpdateUserData, setUser: React.Dispatch<React.SetStateAction<IUser | null>>, router: Router, setMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	try {
		setIsSending(true);
		setMessage('');

		const response = await fetchWithAuth('/dashboard/change_username_avatar', {
			method: 'PATCH',
			body: JSON.stringify(payload),
		}, router);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Error during update');
		}

		setUser(payload)
		setMessage(data.message);
	} catch (error) {
		console.error('Error during update:', error);
		setMessage(error instanceof Error ? error.message : 'Unknown error');
	} finally {
		setIsSending(false);
	}
};
