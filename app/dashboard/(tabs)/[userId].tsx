import { useContext, useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { UserContext } from "../context/UserContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { HStack } from "@/components/ui/hstack";

export default function DashboardPage() {
	const [isWeb, setIsWeb] = useState(false);
	const { user } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (Platform.OS === 'web') {
			setIsWeb(true);
		}
	}, [])
	
	return (
		<View className="w-full h-full flex justify-center items-center">
			<HStack className="w-full max-w-[300px] justify-end items-center gap-3 border">
				<Text>
					Benvenuto {user?.username}!
				</Text>
				{
					isWeb ?
					<Pressable onPress={() => router.push('/dashboard/settings')}>
						<View className={`w-10 h-10 cursor-pointer rounded-full overflow-hidden`}>
							<Image style={{ width: '100%', height: '100%' }} source={{uri: user?.avatar_src}} />
						</View>
					</Pressable>
					:
					<View className={`w-10 h-10 rounded-full overflow-hidden`}>
						<Image style={{ width: '100%', height: '100%' }} source={{uri: user?.avatar_src}} />
					</View>
				}
			</HStack>
		</View>
	);
}
