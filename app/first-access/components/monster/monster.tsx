import { VStack } from "@/components/ui/vstack";
import LottieView from "lottie-react-native";
import IMonster from "@/types/monster";

export default function Monster({classMonster}: IMonster) {
	return (
		<VStack className={classMonster}>
			<LottieView
				autoPlay
				style={{
					width: 100,
					height: 100,
				}}
				loop
				source={require('../../assets/monsterFirstAccess.json')}
			/>
		</VStack>
	);
}
