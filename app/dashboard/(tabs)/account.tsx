import { ScrollView, StyleSheet, Image } from "react-native";
import {
  Layout,
  Card,
  Text,
  Divider,
  Button,
  Input,
  Spinner,
} from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../../firebaseConfig";
import { RemoveAccountDialog } from "../../../components/RemoveAccountDialog";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CustomDialog } from "../../../components/CustomDialog";
import { updatePassword } from "firebase/auth";
import { firebaseAuthErrorCode } from "../../../utils/firebaseAuthErrorCode";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function TabAccountScreen() {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState("");
  const [sendPicture, setSendPicture] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [visibleDialog, showDialog] = useState({
    visible: false,
    message: "",
  });
  const [visibleRemoveDialog, showRemoveDialog] = useState({
    visible: false,
  });

  const handleChangeProfilPicture = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
      .then((result) => {
        if (result.canceled === true || !user) return;

        const { uri } = result.assets[0];
        setSendPicture(true);

        return fetch(uri)
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            const storageRef = ref(storage, `account_pictures/${user.uid}`);
            return uploadBytes(storageRef, blob);
          })
          .then(() => {
            return getDownloadURL(ref(storage, `account_pictures/${user.uid}`));
          })
          .then((url) => {
            setPicture(url);
            setSendPicture(false);
          });
      })
      .catch((error) => {
        console.error(error);
        setSendPicture(false);
      });
  };

  const handleRemoveProfilPicture = () => {
    if (!user) return;
    const desertRef = ref(storage, `account_pictures/${user.uid}`);

    deleteObject(desertRef)
      .then(() => {
        setPicture("");
      })
      .catch(() => {
        showDialog({
          visible: true,
          message: "Cette image ne peut pas être supprimée !",
        });
        return;
      });
  };

  const handleChangePersonalInfo = () => {
    if (!firstName || !lastName || !email) {
      showDialog({
        visible: true,
        message: "Tu dois remplir tous les champs d'informations personnelles",
      });
      return;
    }
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    updateDoc(userDocRef, {
      firstName,
      lastName,
    })
      .then(() => {
        showDialog({
          visible: true,
          message:
            "Tes informations personnelles ont été modifiées avec succès !",
        });
      })
      .catch((error) => {
        showDialog({
          visible: true,
          message: firebaseAuthErrorCode(error.code),
        });
      });
  };

  const handleChangePassword = () => {
    if (!password || !passwordConfirm) {
      showDialog({
        visible: true,
        message: "Tu dois remplir tous les champs de mot de passe",
      });
      return;
    }
    if (password !== passwordConfirm) {
      showDialog({
        visible: true,
        message: "Les mots de passe ne correspondent pas",
      });
      return;
    }
    if (!user) return;
    updatePassword(user, password)
      .then(() => {
        showDialog({
          visible: true,
          message: "Ton mot de passe a été modifié avec succès !",
        });
        setPassword("");
        setPasswordConfirm("");
      })
      .catch((error) => {
        showDialog({
          visible: true,
          message: firebaseAuthErrorCode(error.code),
        });
      });
  };

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
      .then(() => {
        return getDownloadURL(ref(storage, `account_pictures/${user.uid}`));
      })
      .then((url) => {
        setPicture(url);
      })
      .catch(() => {
        return;
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
          <Layout style={styles.avatarContainer}>
            <Image
              source={
                picture
                  ? { uri: picture }
                  : require("../../../assets/images/user.png")
              }
              style={styles.avatar}
            />
          </Layout>
          <Divider style={{ marginBottom: 10 }} />
          <Layout style={styles.row}>
            <Button
              size="small"
              status="danger"
              disabled={sendPicture}
              onPress={handleRemoveProfilPicture}
            >
              Supprimer
            </Button>
            <Button
              size="small"
              disabled={sendPicture}
              onPress={handleChangeProfilPicture}
            >
              {sendPicture ? "Envoi en cours ..." : "Modifier"}
            </Button>
          </Layout>
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
            disabled
          />
          <Divider style={{ marginBottom: 10 }} />
          <Button size="small" onPress={handleChangePersonalInfo}>
            Enregistrer
          </Button>
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
          <Button size="small" onPress={handleChangePassword}>
            Enregistrer
          </Button>
        </Card>
        <Button
          size="small"
          status="danger"
          style={styles.marginBottom}
          onPress={() => {
            showRemoveDialog({ visible: true });
          }}
        >
          Supprimer mon compte
        </Button>
        <CustomDialog
          visible={visibleDialog.visible}
          message={visibleDialog.message}
          onClose={() => showDialog({ visible: false, message: "" })}
        />
        <RemoveAccountDialog
          visible={visibleRemoveDialog.visible}
          onClose={() => showRemoveDialog({ visible: false })}
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
    width: "90%",
    marginTop: 20,
    cursor: "default",
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
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
