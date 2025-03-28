import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function viewVisites(){
    const Item = ({ dateVisite, medecin, visiteur, heureArrivee, tempsAttente, heureDepart, avecRdv }: ItemProps) => (
        <View style={styles.item}>
            <Text style={styles.title}>{dateVisite}</Text>
            <Text style={styles.text}>{medecin}</Text>
            <Text style={styles.text}>{visiteur}</Text>
            <Text style={styles.textsmall}>{heureArrivee}</Text>
            <Text style={styles.textsmall}>{tempsAttente}</Text>
            <Text style={styles.textsmall}>{heureDepart}</Text>
            <Text style={styles.textpill}>{avecRdv}</Text>
        </View>
    );
// TODO : Récupérer la liste des visites depuis l'API
// TODO : Créer la liste avec les visites récupérées
    return (
        <SafeAreaView style={styles.container}>
            <Text>Voici la liste de vos visites</Text>
            <View style={styles.view}>
                <FlatList 
                    style={styles.list}
                    data={[{ key: 'Visite 1' }, { key: 'Visite 2' }]} 
                    renderItem={({ item }) => <Item dateVisite={item.key} />}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 20,
    },
    list: {
        width: "100%",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#cc2b31",
        borderStyle: "solid",
        borderRadius: 5,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
    },
    text: {
        fontSize: 16,
    },
    textsmall: {
        fontSize: 14,
    },
    textpill: {
        fontSize: 14,
        backgroundColor: "#cc2b31",
        color: "#fff",
        padding: 5,
        borderRadius: 5,
    },
})