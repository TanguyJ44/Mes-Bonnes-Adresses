import {
  Button,
  Card,
  Text,
  Divider,
  Modal,
  Layout,
  Input,
  Toggle,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { auth, db, storage } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export function AddAddressDialog(props: {
  visible: boolean;
  latitude: number;
  longitude: number;
  onClose: () => void;
}) {
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privateChecked, setPrivateChecked] = React.useState(false);
  const [picture, setPicture] = useState("");
  const [loadAddAddress, setloadAddAddress] = useState(false);

  const handleChoosePicture = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
      .then((result) => {
        if (result.canceled === true || !user) return;

        const { uri } = result.assets[0];
        setPicture(uri);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddAddress = () => {
    if (!user) return;
    setloadAddAddress(true);
    addDoc(collection(db, "address"), {
      name,
      description,
      private: privateChecked,
      picture: !picture ? false : true,
      latitude: props.latitude,
      longitude: props.longitude,
      user_id: user.uid,
    })
      .then((doc) => {
        if (!picture) return;
        return fetch(picture)
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            const storageRef = ref(storage, `address_pictures/${doc.id}`);
            return uploadBytes(storageRef, blob);
          });
      })
      .then(() => {
        props.onClose();
        setloadAddAddress(false);
      })
      .catch((error) => {
        console.error(error);
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
          📍 Nouvelle adresse
        </Text>
        <TouchableOpacity
          style={styles.imageContainer}
          disabled={loadAddAddress}
          onPress={() => {
            handleChoosePicture();
          }}
        >
          <Image
            source={
              picture
                ? { uri: picture }
                : require("../assets/images/picture.png")
            }
            style={styles.image}
          />
        </TouchableOpacity>
        <Input
          label="Nom de l'adresse"
          placeholder="Donne un nom à cette adresse"
          value={name}
          style={styles.marginBottom}
          onChangeText={setName}
        />
        <Input
          label="Description"
          placeholder="Dis-nous en plus sur cette adresse"
          value={description}
          style={styles.marginBottom}
          onChangeText={setDescription}
        />
        <Toggle
          checked={privateChecked}
          style={styles.toggle}
          disabled={loadAddAddress}
          onChange={(checked) => setPrivateChecked(checked)}
        >
          Rendre cette adresse privée
        </Toggle>
        <Divider style={{ marginTop: 10 }} />
        <Layout style={styles.row}>
          <Button
            size="small"
            appearance="ghost"
            style={styles.closeButton}
            disabled={loadAddAddress}
            onPress={() => {
              setPicture("");
              setName("");
              setDescription("");
              setPrivateChecked(false);
              props.onClose();
            }}
          >
            Annuler
          </Button>
          <Button
            size="small"
            style={styles.closeButton}
            disabled={!name || !description || loadAddAddress}
            onPress={() => {
              handleAddAddress();
            }}
          >
            {loadAddAddress ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </Layout>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "90%",
  },
  marginBottom: {
    marginBottom: 15,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 15,
    marginBottom: 20,
  },
  toggle: {
    marginBottom: 10,
    alignSelf: "flex-start",
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
