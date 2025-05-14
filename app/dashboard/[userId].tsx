import { useContext } from "react";
import { Text, View } from "react-native";
import { UserContext } from "./context/UserContext";
import { Image } from "expo-image";

export default function DashboardPage() {
	const { user } = useContext(UserContext);
	
	return (
		<View className="w-full">
			<View className="w-full flex flex-row justify-end items-center p-6 gap-4">
				<Text>
					Benvenuto {user?.username}!
				</Text>
				<View className={`w-10 h-10 rounded-full overflow-hidden`}>
					<Image style={{ width: '100%', height: '100%' }} source={{uri: user?.avatar_src}} />
				</View>
			</View>
		</View>
	);
}
