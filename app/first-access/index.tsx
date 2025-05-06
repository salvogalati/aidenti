import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text, View } from "react-native";
import { IndieFlower_400Regular, useFonts } from '@expo-google-fonts/indie-flower';
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRightIcon, CircleIcon } from "@/components/ui/icon";
import IFirstAccess from "./types/firstAccess";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "@/components/ui/radio";
import { HStack } from "@/components/ui/hstack";

export default function FirstAccessPage() {
	const [fontsLoaded] = useFonts({
		IndieFlower_400Regular,
	});
	const [payload, setPayload] = useState({ username: '', age: '', sex: '' });

	const agePattern = /^[0-9]{0,2}$/;

	const canSubmit =
		payload.username.length > 0 &&
		Number(payload.age) >= 18 &&
		payload.sex;

	if (!fontsLoaded) {
		return null;
	}

	return (
		<VStack className="w-full h-full justify-center items-center">
			<Box className="rounded-md border border-background-200 p-4 flex gap-1">
				<View>
					<Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-lg font-semibold">
						Username
					</Text>
					<Input className="my-1">
						<InputField
							type="text"
							placeholder="Username"
							className="bg-white"
							value={payload.username}
							onChangeText={(text: string) =>
								setPayload((prev: IFirstAccess) => ({
									...prev,
									username: text,
								}))
							}
						/>
					</Input>
				</View>
				<View>
					<Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-lg font-semibold">
						Age
					</Text>
					<Input className="my-1">
						<InputField
							type="text"
							placeholder="Age"
							className="bg-white"
							value={payload.age}
							onChangeText={(text: string) => {
								if (!agePattern.test(text)) return;
								setPayload((prev: IFirstAccess) => ({
									...prev,
									age: text,
								}))
							}}
						/>
					</Input>
				</View>
				<View>
					<Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-lg font-semibold">
						Sex
					</Text>
					<RadioGroup
						value={payload.sex}
						onChange={value =>
							setPayload(prev => ({
								...prev,
								sex: value
							}))
						}
					>
						<HStack space="2xl">
							<Radio value="M">
								<RadioIndicator>
									<RadioIcon as={CircleIcon} />
								</RadioIndicator>
								<RadioLabel>M</RadioLabel>
							</Radio>
							<Radio value="F">
								<RadioIndicator>
									<RadioIcon as={CircleIcon} />
								</RadioIndicator>
								<RadioLabel>F</RadioLabel>
							</Radio>
						</HStack>
					</RadioGroup>
				</View>
				<ButtonGroup>
					<Button
						disabled={!canSubmit}
						className={`${!canSubmit && 'opacity-50'} w-fit self-end mt-4`}
					>
						<ButtonText>Next</ButtonText>
						<ButtonIcon as={ArrowRightIcon} />
					</Button>
				</ButtonGroup>
			</Box>
		</VStack>
	);
}
