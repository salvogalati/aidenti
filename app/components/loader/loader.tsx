import LottieView from "lottie-react-native";
import { VStack } from "../ui/vstack";

export default function Loader() {
	return (
		<>
			<VStack className="max-w-32 max-h-32">
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
