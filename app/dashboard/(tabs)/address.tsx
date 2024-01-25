import { Divider, Layout, List, ListItem, Text } from "@ui-kitten/components";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { auth, db } from "../../../firebaseConfig";

interface IListItem {
  id: string;
  title: string;
  description: string;
}

export default function TabAddressScreen() {
  const user = auth.currentUser;
  const [address, setAddress] = useState<IListItem[]>([]);

  const handleRemoveAddress = (id: string) => {
    deleteDoc(doc(db, "address", id));
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: IListItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      title={item.title}
      description={item.description}
      onPress={() => {
        alert("Maintenez enfoncé pour supprimer l'adresse");
      }}
      onLongPress={() => handleRemoveAddress(item.id)}
    />
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "address"),
      (querySnapshot) => {
        const addr = querySnapshot.docs
          .filter((doc) => doc.data().user_id === user?.uid)
          .map((doc) => ({
            id: doc.id,
            title: doc.data().name,
            description: doc.data().description,
          }));
        setAddress(addr);
      }
    );
    return () => unsubscribe();
  }, []);

  if (address.length === 0) {
    return (
      <Layout style={styles.loadContainer}>
        <Text style={styles.text}>
          Vous n'avez pas encore créé d'adresse{"\n"}
          {"\n"}Cliquer sur votre endroit favori depuis la carte interactive
          pour en créer une !
        </Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <List
        style={styles.container}
        data={address}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  loadContainer: {
    flex: 1,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    width: "80%",
    marginTop: 20,
    textAlign: "center",
  },
});
