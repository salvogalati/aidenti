import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { UserContext } from "./context/UserContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

export default function DashboardPage() {
	const { user } = useContext(UserContext);
	const router = useRouter();
	
	return (
		<View className="w-full">
			<View className="w-full flex flex-row justify-end items-center p-6 gap-4">
				<Text>
					Benvenuto {user?.username}!
				</Text>
				<Pressable onPress={() => router.push('/dashboard/settings')}>
					<View className={`w-10 cursor-pointer h-10 rounded-full overflow-hidden`}>
						<Image style={{ width: '100%', height: '100%' }} source={{uri: user?.avatar_src}} />
					</View>
				</Pressable>
			</View>
		</View>
	);
}
