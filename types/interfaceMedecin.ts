import Cabinet from "./interfaceCabinet";
import Personne from "./interfacePersonne";

export default interface Medecin extends Personne {
    cabinet: Cabinet;
}