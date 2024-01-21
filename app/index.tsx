import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { Button } from "@ui-kitten/components/ui";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page d'accueil</Text>
      <Button style={styles.button}>Text/ACTIVE</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    margin: 2,
  },
});
