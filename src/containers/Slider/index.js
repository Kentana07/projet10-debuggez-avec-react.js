import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData(); // Utiliser contexte pour récupérer les données
  const [index, setIndex] = useState(0); // Index pour contrôler la slide affichée

  // Trier les données par date en ordre décroissant si data?.focus existe
  const byDateDesc = data?.focus
    ? [...data.focus].sort(
        (evtA, evtB) => new Date(evtB.date) - new Date(evtA.date)
      )
    : [];

  // useEffect pour gérer le défilement automatique des slides
  useEffect(() => {
    if (byDateDesc.length > 0) {
      // S'assurer qu'il y a des données avant de démarrer l'intervalle
      const intervalId = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % byDateDesc.length); // Incrémenter l'index ou revenir à 0
      }, 5000); // Changer de slide toutes les 5 secondes

      return () => clearInterval(intervalId); // Nettoyer l'intervalle quand le composant se démonte
    }
    return () => {}; // Retourner une fonction vide si aucune donnée n'est présente
  }, [byDateDesc.length]); // Réinitialiser l'intervalle quand le nombre de slides change

  // Gérer le changement de slide via les boutons radio
  const handleRadioChange = (newIndex) => {
    setIndex(newIndex);
  };

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.id || idx} // Utiliser l'id de l'événement ou l'index comme clé
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`} // Afficher ou cacher la slide selon l'index
        >
          <img src={event.cover} alt={event.title} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={event.id || radioIdx} // Utiliser l'id de l'événement ou l'index pour chaque bouton radio
              type="radio"
              name="radio-button"
              checked={index === radioIdx} // Le bouton est coché si l'index correspond
              onChange={() => handleRadioChange(radioIdx)} // Changer l'index au clic
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
