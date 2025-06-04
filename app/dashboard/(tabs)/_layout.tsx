import { Slot, Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Platform, View } from "react-native";

export default function TabsLayout() {

	if (Platform.OS !== 'web') {
		return (
			<Tabs screenOptions={{ headerShown: false }}>
				<Tabs.Screen name="[userId]" options={{
					tabBarLabel: 'Home',
					tabBarIcon: ({color}) => <FontAwesome color={color} name="home" size={24} />
				}} />
				<Tabs.Screen name="settings/index" options={{
					tabBarLabel: 'Settings',
					tabBarIcon: ({color}) => <FontAwesome color={color} name="cog" size={24} />
				}} />
			</Tabs>
		);
	}

	return (
		<View className='w-full h-full'>
			<Slot />
		</View>
	);
}
