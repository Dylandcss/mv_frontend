import Medecin from '@/types/interfaceMedecin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export default function AddVisite() {
    const [dateVisite, setDateVisite] = useState(new Date());
    const [heureArrivee, setHeureArrivee] = useState(new Date());
    const [heureDepart, setHeureDepart] = useState(new Date());
    const [tempsAttente, setTempsAttente] = useState('');
    const [avecRdv, setAvecRdv] = useState(false);
    const [medecins, setMedecins] = useState<Medecin[]>([]);
    const [selectedMedecin, setSelectedMedecin] = useState<Medecin | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePickerArrivee, setShowTimePickerArrivee] = useState(false);
    const [showTimePickerDepart, setShowTimePickerDepart] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');

                if (!token) {
                    Alert.alert("Erreur", "Vous devez être connecté.");
                    return;
                }

                const medecinsResponse = await fetch("https://s5-4352.nuage-peda.fr/MV/api/APIMedecin.php", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                });
                const medecinsData = await medecinsResponse.json();

                setMedecins(medecinsData);
            } catch (err) {
                Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des données.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async () => {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            Alert.alert("Erreur", "Vous devez être connecté.");
            return;
        }
        if (!selectedMedecin) {
            Alert.alert("Erreur", "Veuillez sélectionner un médecin et un visiteur.");
            return;
        }

        const formData = new FormData();
        formData.append("idMedecin", selectedMedecin.id.toString());
        formData.append("idVisiteur", userId);
        formData.append("dateVisite", dateVisite.toISOString().substring(0, 10));
        formData.append("heureArrivee", heureArrivee.toLocaleTimeString('fr-FR', { hour12: false }));
        formData.append("tempsAttente", tempsAttente);
        formData.append("heureDepart", heureDepart.toLocaleTimeString('fr-FR', { hour12: false }));
        formData.append("avecRdv", avecRdv ? "1" : "0");

        try {
            const response = await fetch("https://s5-4352.nuage-peda.fr/MV/api/APIVisite.php", {
                headers: {
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('userToken'),
                },
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout de la visite");
            }

            Alert.alert("Visite ajoutée avec succès !");
        } catch (error) {
            Alert.alert("Erreur", error instanceof Error ? error.message : "Une erreur inconnue s'est produite");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            {loading ? (
                <Text>Chargement...</Text>
            ) : (
                <>
                    <Text style={{ marginTop: 10 }}>Date de la visite</Text>
                    <Button title={dateVisite.toLocaleDateString()} onPress={() => setShowDatePicker(true)} />
                    {showDatePicker && (
                        <DateTimePicker
                            value={dateVisite}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(Platform.OS === 'ios');
                                if (selectedDate) setDateVisite(selectedDate);
                            }}
                        />
                    )}

                    <Text style={{ marginTop: 10 }}>Médecin</Text>
                    <Picker
                        selectedValue={selectedMedecin}
                        onValueChange={(itemValue) => setSelectedMedecin(itemValue)}
                    >
                        <Picker.Item label="Sélectionnez un médecin" value={null} />
                        {medecins.length === 0 ? (
                            <Picker.Item label="Aucun médecin disponible" value={null} />
                        ) : (
                            medecins.map((med) => (
                                <Picker.Item key={med.id} label={`${med.nom} ${med.prenom}`} value={med} />
                            ))
                        )}
                    </Picker>

                    <Text style={{ marginTop: 10 }}>Heure d'arrivée</Text>
                    <Button
                        title={heureArrivee.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        onPress={() => setShowTimePickerArrivee(true)}
                    />
                    {showTimePickerArrivee && (
                        <DateTimePicker
                            value={heureArrivee}
                            mode="time"
                            display="default"
                            is24Hour={true}
                            onChange={(event, selectedTime) => {
                                setShowTimePickerArrivee(Platform.OS === 'ios');
                                if (selectedTime) setHeureArrivee(selectedTime);
                            }}
                        />
                    )}

                    <Text style={{ marginTop: 10 }}>Temps d'attente (minutes)</Text>
                    <TextInput
                        placeholder="00"
                        keyboardType="numeric"
                        value={tempsAttente}
                        onChangeText={setTempsAttente}
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />

                    <Text style={{ marginTop: 10 }}>Heure de départ</Text>
                    <Button
                        title={heureDepart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        onPress={() => setShowTimePickerDepart(true)}
                    />
                    {showTimePickerDepart && (
                        <DateTimePicker
                            value={heureDepart}
                            mode="time"
                            display="default"
                            is24Hour={true}
                            onChange={(event, selectedTime) => {
                                setShowTimePickerDepart(Platform.OS === 'ios');
                                if (selectedTime) setHeureDepart(selectedTime);
                            }}
                        />
                    )}

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <Text>Avec RDV</Text>
                        <Switch value={avecRdv} onValueChange={setAvecRdv} />
                    </View>

                    <Button title="Ajouter Visite" onPress={handleSubmit} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    datePicker: {
    },
    textInput: {
        borderBottomWidth: 1,
        marginBottom: 10,
    },
})