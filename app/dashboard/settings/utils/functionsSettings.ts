import { fetchWithAuth, removeToken } from "@/utils/functionsAuth";
import { Router } from "expo-router";

export const logout = async (router: Router) => {
	try {

		const res = await fetchWithAuth('/logout', { method: 'GET' }, router);

		if (!res.ok) {
			throw new Error(`Error during Log out, please retry!`);
		}

		await removeToken('access_token');
		await removeToken('refresh_token');
		router.replace('/');

	} catch (e) {
		console.error(e);
	}
}
