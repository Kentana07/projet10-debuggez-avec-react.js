import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9; // Nombre par page

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(); // État pour le type de filtre sélectionné
  const [currentPage, setCurrentPage] = useState(1); // État pour la page courante dans la pagination

  // Filtrer les événements en fonction du type sélectionné et gérer la pagination
  const filteredEvents =
    (type
      ? data?.events.filter((event) => event.type === type) // Filtrer par type si un type est sélectionné
      : data?.events) || // Sinon, utiliser tous les événements
    [];

  // Calculer les événements à afficher sur la page courante
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // Fonction pour changer le type de filtre
  const changeType = (evtType) => {
    setCurrentPage(1); // Réinitialiser à la première page lorsque le filtre change
    setType(evtType); // Réinitialiser le filtre si "Toutes" est sélectionné
  };

  // Calculer le nombre total de pages
  const pageNumber = Math.ceil((filteredEvents.length || 0) / PER_PAGE);
  // Créer une liste de types pour le filtre
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>Une erreur est survenue</div>}
      {data === null ? (
        "Chargement en cours..."
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => changeType(value)}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber).keys()].map((n) => (
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
