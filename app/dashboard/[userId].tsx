import { useContext } from "react";
import { Text, View } from "react-native";
import { UserContext } from "./context/UserContext";

export default function DashboardPage() {
	const { user } = useContext(UserContext);
	
	return (
		<View>
			<Text>
				Dashboard, benvenuto {user?.name}!
			</Text>
		</View>
	);
}
