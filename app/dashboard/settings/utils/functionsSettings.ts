import { TOKEN_KEYS } from "@/constans/tokensKeys";
import { fetchWithAuth, removeToken } from "@/utils/functionsAuth";
import { Router } from "expo-router";

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
