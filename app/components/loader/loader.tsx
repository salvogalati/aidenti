import LottieView from "lottie-react-native";
import { VStack } from "../ui/vstack";
import Monster from "./components/monster";

export default function Loader() {
	return (
		<>
			<Monster classMonster="max-w-52 max-h-52" />
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
