import React from "react";
import { StyleSheet } from "react-native";
import {
  Card,
  Text,
  Input,
  Divider,
  Button,
  Layout,
  Spinner,
} from "@ui-kitten/components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import useAuthStatus from "./useAuthStatus";
import { AuthDialog } from "../../components/AuthDialog";
import { firebaseAuthErrorCode } from "../../utils/firebaseAuthErrorCode";
import { auth } from "../../firebaseConfig";

const LoginScreen = () => {
  const router = useRouter();
  const { isLoading } = useAuthStatus();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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

  const handleLogin = () => {
    if (!email || !password) {
      showDialog({
        visible: true,
        message: "Certains champs de texte semblent vides !",
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
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
          Connexion
        </Text>
        <Divider style={styles.marginBottom} />
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
        <Divider style={styles.marginBottom} />
        <Layout style={styles.row}>
          <Button
            style={styles.forgotPassword}
            size="small"
            appearance="ghost"
            onPress={() => {
              router.replace("/auth/recovery");
            }}
          >
            Mot de passe oublié ?
          </Button>
          <Button style={styles.button} size="small" onPress={handleLogin}>
            Connexion
          </Button>
        </Layout>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotPassword: {
    alignSelf: "flex-start",
  },
  button: {
    alignSelf: "flex-end",
  },
});

export default LoginScreen;
