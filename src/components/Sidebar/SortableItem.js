// src/components/Sidebar/SortableItem.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, page, selectedPage, onSelectPage, onDeletePage }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={() => onSelectPage(page.id)}
      className={selectedPage === page.id ? 'selected' : ''}
    >
      {/* Bouton pour glisser */}
      <button {...attributes} {...listeners} className="drag-handle">
        🟰
      </button>

      {/* Titre de la page */}
      <span>{page.title || `Page ${page.id}`}</span>

      {/* Bouton de suppression */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Empêcher la sélection de la page
          onDeletePage(page.id);
        }}
        className="delete-button"
      >
        Supprimer
      </button>
    </li>
  );
};