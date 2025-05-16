import { SetStateAction } from "react";

export const forgotPassword = async (email: string, setMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>) => {
	try {

		setIsSending(true);
		const forgotPasswordData = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/forgot-password`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ email }),
		});

		const data = await forgotPasswordData.json();

		if (!forgotPasswordData.ok) {
			throw new Error(data.message || 'Request failed');
		}

		setMessage(data.message)
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
			setMessage(error.message)
		} else {
			console.error('Unknown error:', error);
		}
	} finally {
		setIsSending(false);
	}
}
