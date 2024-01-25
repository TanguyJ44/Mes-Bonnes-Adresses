import {
  Button,
  Card,
  Text,
  Divider,
  Modal,
  Layout,
} from "@ui-kitten/components";
import { StyleSheet, Image } from "react-native";

export function DetailsAddressDialog(props: {
  visible: boolean;
  id: string;
  name: string;
  description: string;
  private: boolean;
  picture: string;
  author: string;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={props.visible}
      backdropStyle={styles.backdrop}
      style={styles.modal}
    >
      <Card disabled={true}>
        <Text style={styles.marginBottom} category="h6">
          📍 {props.name}
        </Text>
        <Layout style={styles.imageContainer}>
          <Image
            source={
              props.picture
                ? { uri: props.picture }
                : require("../assets/images/picture-no-edit.png")
            }
            style={styles.image}
          />
        </Layout>
        <Text style={styles.marginBottom} category="s1">
          Description :{" "}
          <Text style={styles.marginBottom}>{props.description}</Text>
        </Text>
        <Text style={styles.marginBottom} category="s1">
          Type d'adresse :{" "}
          <Text style={styles.marginBottom}>
            {props.private ? "Privée" : "Publique"}
          </Text>
        </Text>
        <Text style={styles.marginBottom} category="s1">
          Auteur : <Text style={styles.marginBottom}>{props.author}</Text>
        </Text>
        <Divider style={{ marginTop: 10 }} />
        <Button
          size="small"
          appearance="ghost"
          style={styles.closeButton}
          onPress={() => props.onClose()}
        >
          ❌ Fermer
        </Button>
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
    width: 150,
    height: 150,
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
