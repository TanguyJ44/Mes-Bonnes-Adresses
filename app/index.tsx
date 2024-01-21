import { StyleSheet } from "react-native";
import { Layout, Text, Button } from "@ui-kitten/components/ui";

export default function HomeScreen() {
  return (
    <Layout style={styles.container}>
      {/* Add logo */}
      <Text category="h5" style={styles.title}>
        Mes Bonnes Adresses
      </Text>
      <Text style={styles.description}>
        Bienvenue sur l'application Mes Bonnes Adresses !{"\n"}
        Fini les longues recherches sur internet pour trouver un restaurant,
        {"\n"}
        une boutique ou un service de qualité.
        {"\n"}
        Mes Bonnes Adresses vous permet de trouver et partager simplement
        {"\n"}
        les meilleures adresses autour de vous.
      </Text>
      <Layout style={styles.row}>
        <Button
          size="small"
          onPress={() => {
            //
          }}
        >
          Inscription
        </Button>
        <Button
          style={styles.button}
          size="small"
          onPress={() => {
            //
          }}
        >
          Connexion
        </Button>
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
  },
  button: {
    margin: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
