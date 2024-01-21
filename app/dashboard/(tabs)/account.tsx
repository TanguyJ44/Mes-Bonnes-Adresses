import { ScrollView, StyleSheet } from "react-native";
import {
  Layout,
  Card,
  Text,
  Divider,
  Button,
  Input,
  Avatar,
  Spinner,
} from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebaseConfig";
import { RemoveAccountDialog } from "../../../components/RemoveAccountDialog";
import { doc, getDoc } from "firebase/firestore";

export default function TabAccountScreen() {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [visibleDialog, showDialog] = useState({
    visible: false,
  });

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef)
      .then((userDocSnap) => {
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(user.email || "");
        }
      })
      .finally(() => {
        setLoading(true);
      });
  }, []);

  if (!loading) {
    return (
      <Layout style={styles.container}>
        <Spinner size="giant" />
        <Text style={styles.text}>
          Chargement de vos informations personnelles ...
        </Text>
      </Layout>
    );
  }

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
            value={email}
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
        <Button
          size="small"
          status="danger"
          style={styles.marginBottom}
          onPress={() => {
            showDialog({ visible: true });
          }}
        >
          Supprimer mon compte
        </Button>
        <RemoveAccountDialog
          visible={visibleDialog.visible}
          onClose={() => showDialog({ visible: false })}
        />
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
  text: {
    marginTop: 20,
  },
});
