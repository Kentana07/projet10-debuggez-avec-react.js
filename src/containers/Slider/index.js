import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  // Utilisation d'un hook pour récupérer les données nécessaires.
  const { data } = useData();
  // État local pour suivre l'index de l'élément actuellement affiché.
  const [index, setIndex] = useState(0);

  // Tri des événements par date en ordre décroissant.
  const byDateDesc = data?.focus.sort((evtA, evtB) => 
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  );

  // Fonction pour passer à la carte suivante avec un intervalle de 5 secondes.
  const nextCard = () => {
    setTimeout(() => {
      // Met à jour l'index pour montrer la prochaine carte ou retourner au début si c'est la dernière.
      setIndex(index + 1 < byDateDesc?.length ? index + 1 : 0);
    }, 5000);
  };

  useEffect(() => {
    nextCard();
  });
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <>
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  key={`${event.id}`}
                  type="radio"
                  name="radio-button"
                  checked={idx === radioIdx}
                />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;
