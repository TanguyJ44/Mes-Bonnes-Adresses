import {
  Button,
  Card,
  Text,
  Divider,
  Modal,
  Layout,
  Input,
} from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { deleteUser } from "firebase/auth";
import { auth } from "../firebaseConfig";

export function RemoveAccountDialog(props: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const user = auth.currentUser;
  const [deleteKey, setDeleteKey] = React.useState("");

  const handleDeleteAccount = () => {
    if (!user) return;
    deleteUser(user)
      .then(() => {
        router.replace("/");
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          alert(
            "Vous êtes resté inactif trop longtemps. Veuillez vous reconnecter pour supprimer votre compte."
          );
          return;
        }
      });
  };

  return (
    <Modal
      visible={props.visible}
      backdropStyle={styles.backdrop}
      style={styles.modal}
    >
      <Card disabled={true}>
        <Text style={styles.marginBottom} category="h6">
          🚨 Supprimer mon compte
        </Text>
        <Text style={styles.marginBottom}>
          Vous êtes sur le point de supprimer votre compte. Cette action est
          irréversible et entraînera la suppression de toutes vos données
          personnelles.
        </Text>
        <Text style={styles.marginBottom}>
          Pour confirmer la suppression de votre compte, veuillez saisir le mot
          "<b>supprimer</b>" dans le champ ci-dessous :
        </Text>
        <Input
          placeholder="supprimer"
          value={deleteKey}
          onChangeText={setDeleteKey}
        />
        <Divider style={{ marginTop: 10 }} />
        <Layout style={styles.row}>
          <Button
            size="small"
            appearance="ghost"
            style={styles.closeButton}
            onPress={() => {
              setDeleteKey("");
              props.onClose();
            }}
          >
            Annuler
          </Button>
          <Button
            size="small"
            status="danger"
            style={styles.closeButton}
            onPress={handleDeleteAccount}
            disabled={deleteKey !== "supprimer"}
          >
            Confirmer la suppression
          </Button>
        </Layout>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "40%",
  },
  marginBottom: {
    marginBottom: 15,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
