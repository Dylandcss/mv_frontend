import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>(""); // Etat pour le message d'erreur

    function decodeJWT(token: string) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = JSON.parse(atob(base64));
        return jsonPayload;
    }

    const storeToken = async (token: string) => {
        try {
            await AsyncStorage.setItem('userToken', token);
        } catch (error) {
            console.error('Erreur lors du stockage du token', error);
        }
    };

    const submitForm = async () => {
        try {
            const response = await fetch("https://s5-4352.nuage-peda.fr/MV/api/APIAuth.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            console.log("Statut de la réponse :", response.status);
            const responseText = await response.text();
            console.log("Réponse du serveur :", responseText);

            if (!response.ok) {
                throw new Error(`Erreur ${response.status} : ${responseText}`);
            }

            const data = JSON.parse(responseText);
            console.log("Données reçues :", data);

            const token = data.token;
            console.log("Token :", token);

            const payload = decodeJWT(token);

            await AsyncStorage.setItem('userId', payload['userId'].toString());
            await storeToken(token);

            setErrorMessage(""); // Réinitialiser le message d'erreur en cas de succès
            navigation.navigate("home");
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la connexion :", error.message);
                setErrorMessage("Identifiants incorrects, veuillez réessayer."); // Mettre à jour l'état d'erreur
            } else {
                console.error("Erreur lors de la connexion :", error);
                setErrorMessage("Une erreur inconnue est survenue, veuillez réessayer.");
            }
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    console.log("Token trouvé, redirection vers l'écran 'home'");
                    navigation.navigate("home");
                }
            } catch (error) {
                console.error('Erreur lors de la vérification du token', error);
            }
        };

        checkToken();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text>E-mail :</Text>
            <TextInput    
                autoComplete='email'    
                autoCapitalize='none'
                textContentType="emailAddress"
                autoCorrect={false}
                autoFocus={true}     
                placeholder="john.doe@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.textinput} />
            <Text>Mot de passe :</Text>
            <TextInput       
                autoComplete='password'
                secureTextEntry={true}
                textContentType="password"          
                placeholder="*********"
                value={password}
                onChangeText={setPassword}
                style={styles.textinput} />
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <Button title="Se connecter" onPress={submitForm} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    textinput: {
        borderBottomWidth: 1,
        marginBottom: 10,
        width: '100%',
        padding: 5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    }
});
