import React from "react";
import { StyleSheet } from "react-native";
import {
  Card,
  Text,
  Input,
  Divider,
  Button,
  CheckBox,
  Layout,
  Spinner,
} from "@ui-kitten/components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import useAuthStatus from "./useAuthStatus";
import { AuthDialog } from "../../components/AuthDialog";
import { firebaseAuthErrorCode } from "../../utils/firebaseAuthErrorCode";
import { auth, db } from "../../firebaseConfig";

const RegisterScreen = () => {
  const router = useRouter();
  const { isLoading } = useAuthStatus();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [cgu, setCGU] = React.useState(false);
  const [visibleDialog, showDialog] = React.useState({
    visible: false,
    message: "",
  });

  if (isLoading) {
    return (
      <Layout style={styles.container}>
        <Spinner size="giant" />
        <Text style={{ marginTop: 10 }}>Chargement en cours ...</Text>
      </Layout>
    );
  }

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      showDialog({
        visible: true,
        message: "Certains champs de texte semblent vides !",
      });
      return;
    }

    if (!cgu) {
      showDialog({
        visible: true,
        message: "Tu dois accepter les conditions générales d'utilisation !",
      });
      return;
    }

    if (password !== passwordConfirm) {
      showDialog({
        visible: true,
        message: "Les mots de passe ne correspondent pas !",
      });
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
        });
      })
      .then(() => {
        router.replace("/dashboard");
      })
      .catch((error) => {
        showDialog({
          visible: true,
          message: firebaseAuthErrorCode(error.code),
        });
      });
  };

  return (
    <Layout level="3" style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.marginBottom} category="h4">
          Inscription
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
        <Input
          label="Mot de passe"
          placeholder="Entrer votre mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.marginBottom}
        />
        <Input
          label="Confirmer mot de passe"
          placeholder="Entrer à nouveau votre mot de passe"
          secureTextEntry
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          style={styles.marginBottom}
        />
        <CheckBox
          checked={cgu}
          style={styles.cgu}
          onChange={(nextChecked) => setCGU(nextChecked)}
        >
          J'accepte les conditions générales d'utilisation
        </CheckBox>
        <Divider style={styles.marginBottom} />
        <Button style={styles.button} size="small" onPress={handleRegister}>
          S'inscrire
        </Button>
      </Card>
      <AuthDialog
        visible={visibleDialog.visible}
        message={visibleDialog.message}
        onClose={() => showDialog({ visible: false, message: "" })}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "40%",
    cursor: "default",
  },
  marginBottom: {
    marginBottom: 15,
  },
  cgu: {
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    alignSelf: "flex-end",
  },
});

export default RegisterScreen;
