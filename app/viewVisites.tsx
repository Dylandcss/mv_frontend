import Visite from "@/types/interfaceVisite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getVisites = async (): Promise<Visite[]> => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetch('https://s5-4352.nuage-peda.fr/MV/api/APIVisite.php?id=' + userId
                , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('userToken'),
                },
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
}


export default function ViewVisites(){

    const Item = ({ dateVisite, medecin, visiteur, heureArrivee, tempsAttente, heureDepart, avecRdv }: Visite) => (
        <View style={styles.item}>
            <Text style={styles.title}>{new Date(dateVisite).toLocaleDateString('fr')}</Text>
            <Text style={styles.text}>{"Médecin : " + medecin.nom + " " + medecin.prenom}</Text>
            <Text style={styles.text}>{"Visiteur : " + visiteur.nom + " " + visiteur.prenom}</Text>
            <Text style={styles.textsmall}>{"Heure d'arrivée : " + heureArrivee}</Text>
            <Text style={styles.textsmall}>{"Temps d'attente : " + tempsAttente + " minutes"}</Text>
            <Text style={styles.textsmall}>{"Heure de départ : " + heureDepart}</Text>
            <Text style={[styles.textpill, { backgroundColor: avecRdv ? "#32a852" : "#cc2b31" }]}>
                {avecRdv ? "Avec RDV" : "Sans RDV"}
            </Text>
        </View>
    );

    const [visites, setVisites] = useState<Visite[]>([]);

    useEffect(() => {
        const fetchVisites = async () => {
            const data = await getVisites();
            setVisites(data);
        };
        fetchVisites();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view}>
                <FlatList 
                    style={styles.list}
                    data={visites} 
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Item 
                            dateVisite={item.dateVisite} 
                            medecin={item.medecin} 
                            visiteur={item.visiteur} 
                            heureArrivee={item.heureArrivee} 
                            tempsAttente={item.tempsAttente} 
                            heureDepart={item.heureDepart} 
                            avecRdv={item.avecRdv} 
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
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
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: "#cc2b31",
        borderStyle: "solid",
        borderRadius: 5,
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
        width: 100,
        fontSize: 14,
        backgroundColor: "#cc2b31",
        color: "#fff",
        textAlign: "center",
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
    },
})