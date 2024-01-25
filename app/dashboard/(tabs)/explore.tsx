import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Layout, Spinner, Text } from "@ui-kitten/components";
import { AddAddressDialog } from "../../../components/AddAddressDialog";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db, storage } from "../../../firebaseConfig";
import { DetailsAddressDialog } from "../../../components/DetailsAddressDialog";
import { getDownloadURL, ref } from "firebase/storage";

interface Marker {
  id: string;
  name: string;
  description: string;
  private: boolean;
  picture: string;
  author: string;
  color?: string;
  latitude: number;
  longitude: number;
}

export default function TabExploreScreen() {
  const user = auth.currentUser;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [location, setLocation]: any = useState(null);
  const [address, setAddress] = useState<Marker[]>([]);
  const [detailsPicture, setDetailsPicture] = useState("");
  const [detailsAuthor, setDetailsAuthor] = useState("");
  const [visibleAddAddressDialog, showAddAddressDialog] = useState({
    visible: false,
    latitude: 0,
    longitude: 0,
  });
  const [visibleDetailsAddressDialog, showDetailsAddressDialog] = useState({
    visible: false,
    id: "",
    name: "",
    description: "",
    private: false,
    picture: "",
    author: "",
  });

  const handleDetailsAddressDialog = (addr: Marker) => {
    setDetailsPicture("");
    showDetailsAddressDialog({
      visible: true,
      id: addr.id,
      name: addr.name,
      description: addr.description,
      private: addr.private,
      picture: detailsPicture,
      author: detailsAuthor,
    });

    getDoc(doc(db, "users", addr.author)).then((doc) => {
      if (doc.exists()) {
        setDetailsAuthor(
          doc.data().firstName + " " + doc.data().lastName.slice(0, 1)
        );
      } else {
        setDetailsAuthor("Utilisateur supprimé");
      }
    });

    if (addr.picture) {
      getDownloadURL(ref(storage, `address_pictures/${addr.id}`))
        .then((url) => {
          setDetailsPicture(url);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Vous devez autoriser l'accès à la localisation");
        return;
      }

      let location: any = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "address"),
      (querySnapshot) => {
        const newAddresses = querySnapshot.docs
          .filter(
            (doc) =>
              !doc.data().private === true || doc.data().user_id === user?.uid
          )
          .map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            private: doc.data().private,
            picture: doc.data().picture,
            author: doc.data().user_id,
            color:
              doc.data().user_id === user?.uid
                ? doc.data().private
                  ? "blue"
                  : "orange"
                : "red",
            latitude: doc.data().latitude,
            longitude: doc.data().longitude,
          }));
        setAddress(newAddresses);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <Layout style={styles.container}>
      {!mapLoaded && (
        <Layout style={styles.loadContainer}>
          <Spinner size="giant" />
          <Text style={styles.text}>
            Chargement de la carte interactive ...
          </Text>
        </Layout>
      )}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onLongPress={(e) => {
            showAddAddressDialog({
              visible: true,
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
          onMapReady={() => {
            setMapLoaded(true);
          }}
        >
          {address.map((maker: Marker) => (
            <Marker
              key={maker.id}
              title={maker.name}
              pinColor={maker.color}
              coordinate={{
                latitude: maker.latitude,
                longitude: maker.longitude,
              }}
              onPress={() => {
                handleDetailsAddressDialog(maker);
              }}
            />
          ))}
        </MapView>
      )}
      <AddAddressDialog
        visible={visibleAddAddressDialog.visible}
        latitude={visibleAddAddressDialog.latitude}
        longitude={visibleAddAddressDialog.longitude}
        onClose={() =>
          showAddAddressDialog({ visible: false, latitude: 0, longitude: 0 })
        }
      />
      <DetailsAddressDialog
        visible={visibleDetailsAddressDialog.visible}
        id={visibleDetailsAddressDialog.id}
        name={visibleDetailsAddressDialog.name}
        description={visibleDetailsAddressDialog.description}
        private={visibleDetailsAddressDialog.private}
        picture={visibleDetailsAddressDialog.picture}
        author={visibleDetailsAddressDialog.author}
        onClose={() =>
          showDetailsAddressDialog({
            visible: false,
            id: "",
            name: "",
            description: "",
            private: false,
            picture: "",
            author: "",
          })
        }
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadContainer: {
    flex: 1,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  text: {
    marginTop: 20,
  },
});
