import Medecin from "./interfaceMedecin";
import Visiteur from "./interfaceVisiteur";

export default interface Visite {
    dateVisite: string;
    medecin: Medecin;
    visiteur: Visiteur;
    heureArrivee: string;
    tempsAttente: string;
    heureDepart: string;
    avecRdv: boolean;
}