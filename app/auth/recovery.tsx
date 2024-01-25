import React, { useState } from "react";
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
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "expo-router";
import useAuthStatus from "./useAuthStatus";
import { CustomDialog } from "../../components/CustomDialog";
import { firebaseAuthErrorCode } from "../../utils/firebaseAuthErrorCode";
import { auth } from "../../firebaseConfig";

const RecoveryScreen = () => {
  const router = useRouter();
  const { isLoading } = useAuthStatus();
  const [email, setEmail] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [visibleDialog, showDialog] = useState({
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

  const handleRecovery = () => {
    if (!email) {
      showDialog({
        visible: true,
        message: "Certains champs de texte semblent vides !",
      });
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setRecovery(true);
      })
      .catch((error) => {
        console.log(error.code);
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
          Réinitialiser mon mot de passe
        </Text>
        <Divider style={styles.marginBottom} />
        {!recovery && (
          <Layout>
            <Input
              label="Adresse mail"
              placeholder="Entre votre adresse mail"
              value={email}
              onChangeText={setEmail}
              style={styles.marginBottom}
            />
            <Divider style={styles.marginBottom} />
            <Button style={styles.button} size="small" onPress={handleRecovery}>
              Réinitialiser
            </Button>
          </Layout>
        )}
        {recovery && (
          <>
            <Text style={styles.marginBottom}>
              Un email de réinitialisation de mot de passe vient de t'être
              envoyé. Si un compte est associé à cette adresse mail, tu devrais
              le recevoir d'ici quelques minutes 😎
            </Text>
            <Divider style={styles.marginBottom} />
            <Button
              style={styles.button}
              size="small"
              onPress={() => router.replace("/auth/login")}
            >
              Connexion
            </Button>
          </>
        )}
      </Card>
      <Button
        style={styles.marginTop}
        size="small"
        appearance="ghost"
        onPress={() => {
          router.replace("/auth/login");
        }}
      >
        Retour à la connexion
      </Button>
      <CustomDialog
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
    width: "90%",
    cursor: "default",
  },
  marginTop: {
    marginTop: 15,
  },
  marginBottom: {
    marginBottom: 15,
  },
  button: {
    alignSelf: "flex-end",
  },
});

export default RecoveryScreen;
