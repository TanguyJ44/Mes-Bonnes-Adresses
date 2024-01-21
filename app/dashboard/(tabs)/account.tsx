import { ScrollView, StyleSheet } from "react-native";
import {
  Layout,
  Card,
  Text,
  Divider,
  Button,
  Input,
  Avatar,
} from "@ui-kitten/components";
import { useState } from "react";
import { auth } from "../../../firebaseConfig";

export default function TabAccountScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  return (
    <ScrollView style={{ flex: 1 }}>
      <Layout level="2" style={styles.container}>
        {/* USER PICTURE */}
        <Card style={styles.card}>
          <Text style={styles.marginBottom} category="h5">
            Photo de profil
          </Text>
          <Divider style={styles.marginBottom} />
          <Avatar
            size="giant"
            source={require("../../../assets/images/logo.png")}
          />
          <Divider style={{ marginBottom: 10 }} />
          <Button size="small">Enregistrer</Button>
        </Card>

        {/* USER INFO */}
        <Card style={styles.card}>
          <Text style={styles.marginBottom} category="h5">
            Informations personnelles
          </Text>
          <Divider style={styles.marginBottom} />
          <Input
            label="Prénom"
            placeholder="Entre votre prénom"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.marginBottom}
          />
          <Input
            label="Nom"
            placeholder="Entre votre nom"
            value={lastName}
            onChangeText={setLastName}
            style={styles.marginBottom}
          />
          <Input
            label="Adresse mail"
            placeholder="Entre votre adresse mail"
            value={email || "Erreur de chargement"}
            onChangeText={setEmail}
            style={styles.marginBottom}
          />
          <Divider style={{ marginBottom: 10 }} />
          <Button size="small">Enregistrer</Button>
        </Card>

        {/* USER PASSWORD */}
        <Card style={{ ...styles.card, marginBottom: 20 }}>
          <Text style={styles.marginBottom} category="h5">
            Mot de passe
          </Text>
          <Divider style={styles.marginBottom} />
          <Input
            label="Nouveau mot de passe"
            placeholder="Entrer votre nouveau mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.marginBottom}
          />
          <Input
            label="Confirmer nouveau mot de passe"
            placeholder="Confirmer votre nouveau mot de passe"
            secureTextEntry
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            style={styles.marginBottom}
          />
          <Divider style={styles.marginBottom} />
          <Button size="small">Enregistrer</Button>
        </Card>
        <Button size="small" status='danger' style={styles.marginBottom}>
          Supprimer mon compte
        </Button>
      </Layout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "40%",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marginBottom: {
    marginBottom: 15,
  },
});
