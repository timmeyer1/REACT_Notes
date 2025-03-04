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
      className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
        isActive ? 'bg-blue-50' : ''
      }`}
      onClick={onSelectPage}
    >
      <div className="flex items-center justify-between">
        <button 
          {...attributes} 
          {...listeners} 
          className="text-gray-400 hover:text-gray-700 p-1 mr-2 cursor-grab"
          type="button"
        >
          ≡
        </button>

        <span className="flex-1 truncate">{page.title || `Page ${page.id}`}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeletePage(page.id);
          }}
          className="text-gray-400 hover:text-red-500 p-1 ml-2"
          type="button"
        >
          ×
        </button>
      </div>
    </li>
  );
};