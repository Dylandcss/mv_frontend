import { Link } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/mv.png')} />
      <Link style={styles.link} href="/viewVisites">Voir les visites</Link>
      <Link style={styles.link} href="/addVisite">Ajouter une visite</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    width: 230,
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#cc2b31",
    borderStyle: "solid",
    padding: 10,
    borderRadius: 5,
  }
})
