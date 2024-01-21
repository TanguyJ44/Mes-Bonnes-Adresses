import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

export default function NotFoundScreen() {
  return (
    <>
      <Layout style={styles.container}>
        <Text category="h2" style={styles.title}>Oups !</Text>
        <Text>La page que vous recherchez n'existe pas 😢</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour à l'accueil</Text>
        </Link>
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
