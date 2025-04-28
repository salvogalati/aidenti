import LottieView from "lottie-react-native";
import { VStack } from "../ui/vstack";

export default function Loader() {
	return (
		<>
			<VStack className="max-w-72 max-h-72 gap-2">
				<LottieView
					autoPlay
					style={{
						width: 200,
						height: 200,
					}}
					loop
					source={require('../../assets/monsterLoad.json')}
				/>
			</VStack>
			<VStack className="max-w-52 max-h-52 -mt-12">
				<LottieView
					autoPlay
					style={{
						width: 100,
						height: 100,
					}}
					loop
					source={require('../../assets/load.json')}
				/>
			</VStack>
		</>
	);
}
