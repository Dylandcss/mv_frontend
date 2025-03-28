import Medecin from '@/types/interfaceMedecin';
import Visiteur from '@/types/interfaceVisiteur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, Switch, Text, TextInput, View } from 'react-native';

export default function AddVisite() {
    const [dateVisite, setDateVisite] = useState(new Date());
    const [heureArrivee, setHeureArrivee] = useState(new Date());
    const [heureDepart, setHeureDepart] = useState(new Date());
    const [tempsAttente, setTempsAttente] = useState('');
    const [avecRdv, setAvecRdv] = useState(false);
    const [medecins, setMedecins] = useState<Medecin[]>([]);
    const [visiteurs, setVisiteurs] = useState<Visiteur[]>([]);
    const [selectedMedecin, setSelectedMedecin] = useState<Medecin|null>(null);
    const [selectedVisiteur, setSelectedVisiteur] = useState<Visiteur|null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePickerArrivee, setShowTimePickerArrivee] = useState(false);
    const [showTimePickerDepart, setShowTimePickerDepart] = useState(false);

    useEffect(() => {
        fetch("https://s5-4352.nuage-peda.fr/MV/api/APIMedecin.php")
            .then(res => res.json())
            .then(data => setMedecins(data))
            .catch(err => console.error("Erreur lors de la récupération des médecins", err));
        
        fetch("https://s5-4352.nuage-peda.fr/MV/api/APIVisiteur.php")
            .then(res => res.json())
            .then(data => setVisiteurs(data))
            .catch(err => console.error("Erreur lors de la récupération des visiteurs", err));
    }, []);

    const handleSubmit = async () => {
        if (!selectedMedecin || !selectedVisiteur) {
            Alert.alert("Erreur", "Veuillez sélectionner un médecin et un visiteur.");
            return;
        }

        const visite = {
            medecin: selectedMedecin,
            visiteur: selectedVisiteur,
            dateVisite: dateVisite.toDateString,
            heureArrivee: heureArrivee.toLocaleTimeString('fr'), 
            tempsAttente: parseInt(tempsAttente, 10),
            heureDepart: heureDepart.toLocaleTimeString('fr'),
            avecRdv: avecRdv ? 1 : 0,
        };

        console.log(visite);

        try {
            const response = await fetch("https://s5-4352.nuage-peda.fr/MV/api/APIVisite.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(visite),
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
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ajouter une visite</Text>
            
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

            <Text>Médecin</Text>
            <Picker
                selectedValue={selectedMedecin}
                onValueChange={(itemValue) => setSelectedMedecin(itemValue)}
            >
                <Picker.Item label="Sélectionnez un médecin" value={null} />
                {medecins.map((med) => (
                    <Picker.Item key={med.id} label={`${med.nom} ${med.prenom}`} value={med} />
                ))}
            </Picker>

            <Text>Visiteur</Text>
            <Picker
                selectedValue={selectedVisiteur}
                onValueChange={(itemValue) => setSelectedVisiteur(itemValue)}
            >
                <Picker.Item label="Sélectionnez un visiteur" value={null} />
                {visiteurs.map((vis) => (
                    <Picker.Item key={vis.id} label={`${vis.nom} ${vis.prenom}`} value={vis} />
                ))}
            </Picker>
            
            <Text>Heure d'arrivée</Text>
            <Button title={heureArrivee.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} onPress={() => setShowTimePickerArrivee(true)} />
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

            <Text>Temps d'attente (minutes)</Text>
            <TextInput
                keyboardType="numeric"
                value={tempsAttente}
                onChangeText={setTempsAttente}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            
            <Text>Heure de départ</Text>
            <Button title={heureDepart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} onPress={() => setShowTimePickerDepart(true)} />
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
        </View>
    );
};
