import { Router } from "expo-router";
import { IUser } from "../types/user";

export const getUserData = async (userId: string, arrayKays: string[], setUser: React.Dispatch<React.SetStateAction<IUser | null>>, router: Router) => {
	try {
		const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/get_userdata`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: "POST",
			body: JSON.stringify({ id: userId, keys: arrayKays }),
		});

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
