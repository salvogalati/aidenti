import LottieView from "lottie-react-native";
import { VStack } from "../ui/vstack";

export default function Loader() {
	return (
		<>
			<VStack className="max-w-52 max-h-52 gap-2">
				<LottieView
					autoPlay
					style={{
						width: 100,
						height: 100,
					}}
					loop
					source={require('../../assets/monsterLoad.json')}
				/>
			</VStack>
			<VStack className="max-w-24 max-h-24 -mt-6">
				<LottieView
					autoPlay
					style={{
						width: 50,
						height: 50,
					}}
					loop
					source={require('../../assets/load.json')}
				/>
			</VStack>
		</>
	);
}
