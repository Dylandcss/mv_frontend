import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="addVisite" options={{ title: "Ajouter une visite" }} />
    <Stack.Screen name="viewVisites" options={{ title: "Voir les visites" }} />
  </Stack>;
}
