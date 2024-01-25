import { StyleSheet, Image } from "react-native";
import { Layout, Text, Button } from "@ui-kitten/components/ui";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Layout style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
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
            router.replace("/auth/register");
          }}
        >
          Inscription
        </Button>
        <Button
          style={styles.button}
          size="small"
          onPress={() => {
            router.replace("/auth/login");
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  title: {
    marginBottom: 15,
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
