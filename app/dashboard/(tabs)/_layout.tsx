import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs, useRouter } from "expo-router";

import Colors from "../../../constants/Colors";
import { useState, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

import React from "react";
import { Layout, Spinner, Text } from "@ui-kitten/components";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const router = useRouter();
  const [userInitializing, setUserInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const colorScheme = "light";

  const onAuthStateChangedHandler = (user: any) => {
    setUser(user);
    if (userInitializing) {
      setUserInitializing(false);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.replace("/auth/login");
      })
      .catch(() => {
        alert("Une erreur est survenue lors de la déconnexion.");
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedHandler);

    return unsubscribe;
  }, []);

  if (userInitializing) {
    return (
      <Layout style={styles.container}>
        <Spinner size="giant" />
        <Text style={styles.text}>
          Chargement de votre dashboard en cours ...
        </Text>
      </Layout>
    );
  }

  if (!userInitializing && !user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerRight: () => (
          <Pressable onPress={handleLogout}>
            {({ pressed }) => (
              <FontAwesome
                name="sign-out"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorer",
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="address"
        options={{
          title: "Mes adresses",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="map-marker" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Mon compte",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 20,
  },
});
