// src/components/Sidebar/SortableItem.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, page, isActive, onSelectPage, onDeletePage }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`page-item ${isActive ? 'active' : ''}`}
      onClick={onSelectPage}
    >
      <div className="page-item-content">
        {/* Bouton pour glisser */}
        <button {...attributes} {...listeners} className="drag-handle" type="button">
          ≡
        </button>

        {/* Titre de la page */}
        <span className="page-title">{page.title || `Page ${page.id}`}</span>

        {/* Bouton de suppression */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Empêcher la sélection de la page
            onDeletePage(page.id);
          }}
          className="delete-button"
          type="button"
        >
          ×
        </button>
      </div>
    </li>
  );
};