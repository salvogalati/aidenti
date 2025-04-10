import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SetStateAction, useState } from 'react';

const getMoviesFromApi = async (setData: React.Dispatch<SetStateAction<string>>) => {
  const res = await fetch('http://127.0.0.1:5000/messaggi')
  const data = await res.json()
  setData(data)
};

export default function TabOneScreen() {
  const [data, setData] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Button title='Button' onPress={() => getMoviesFromApi(setData)} />
      {
        data && data
      }
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
