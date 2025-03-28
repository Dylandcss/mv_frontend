import Medecin from "./interfaceMedecin";
import Visiteur from "./interfaceVisiteur";

export default interface Visite {
    dateVisite: string;
    medecin: Medecin;
    visiteur: Visiteur;
    heureArrivee: string;
    tempsAttente: number;
    heureDepart: string;
    avecRdv: number;
}