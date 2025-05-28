import { Router } from "expo-router";
import { IUser } from "../types/user";
import { fetchWithAuth } from "@/utils/functionsAuth";

export const getUserData = async (userId: string, arrayKays: string[], setUser: React.Dispatch<React.SetStateAction<IUser | null>>, router: Router) => {
	try {
		const res = await fetchWithAuth('/api/get_userdata', {
			method: 'POST',
			body: JSON.stringify({ id: userId, keys: arrayKays }),
		}, router);

		if (!res.ok) {
			throw new Error(`Error to fetch datas`);
		}

		const data = await res.json();

		if (!data || !data.user_data) {
			throw new Error(data.message || 'User\'s datas not found');
		}
	
		setUser(data.user_data);
	} catch (e) {
		console.error(e);
		setUser(null);
		router.push('/');
	}
}
