import { HStack } from "@/components/ui/hstack";
import { CircleIcon } from "@/components/ui/icon";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "@/components/ui/radio";
import IFirstAccess from "@/first-access/types/firstAccess";
import IUsername from "@/first-access/types/username";
import { View, Text } from "react-native";

export default function Sex({ payload, setPayload }: IUsername) {
    return (
        <View>
        <Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-lg font-semibold">
            Sex
        </Text>
        <RadioGroup
            value={payload.sex}
            onChange={value =>
                setPayload((prev: IFirstAccess) => ({
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
    );
}
