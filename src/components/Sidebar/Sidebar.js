// src/components/Sidebar/Sidebar.js
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import './Sidebar.css';

const Sidebar = ({ pages, selectedPage, onAddPage, onSelectPage, onDeletePage }) => {
  return (
    <div className="sidebar">
      <button onClick={onAddPage} className="sidebar-button">
        Nouvelle Page
      </button>
      <SortableContext items={pages} strategy={verticalListSortingStrategy}>
        {pages.map((page) => (
          <SortableItem
            key={page.id}
            id={page.id}
            page={page}
            selectedPage={selectedPage}
            onSelectPage={onSelectPage}
            onDeletePage={onDeletePage}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default Sidebar;