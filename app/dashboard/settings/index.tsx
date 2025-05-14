import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { UserContext } from "../context/UserContext";
import { Link } from "expo-router";

export default function Settings() {
    const { user, setUser } = useContext(UserContext);

    return (
        <View>
            <Text>
                {user?.name}
            </Text>
            <Button
                title="Modifica Nome"
                onPress={() => {
                    if (user) {
                        setUser({ ...user, name: "Salvo" });
                    }
                }}
            />
            <Link href="/dashboard/jedo">
                <Text>
                    Torna alla Dashboard
                </Text>
            </Link>
        </View>
    );
}
