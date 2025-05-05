import { getTokenFromUrl, verifyEmail } from "@/utils/functionsAuth";
import React from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { IndieFlower_400Regular, useFonts } from '@expo-google-fonts/indie-flower';

export default function VerifyEmailPage() {
	const [token, setToken] = React.useState('');
	const [message, setMessage] = React.useState('');
	const [fontsLoaded] = useFonts({
		IndieFlower_400Regular,
	});

	useEffect(() => {
		getTokenFromUrl(setToken);
		if (token) {
			verifyEmail(token, setMessage);
		}
	}, [token]);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View className="w-full h-full flex justify-center items-center">
			{
				message &&
					<Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-3xl">
						{message}
					</Text>
			}
		</View>
	);
}
