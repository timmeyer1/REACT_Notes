// src/components/Sidebar/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { generateSlug } from '../../utils/url';
import './Sidebar.css';

const Sidebar = ({ pages, currentPageId, onAddPage, onDeletePage }) => {
  const navigate = useNavigate();

  const handleSelectPage = (page) => {
    navigate(`/${generateSlug(page.title)}_${page.id}`);
  };

  return (
    <div className="sidebar">
      <button onClick={onAddPage} className="sidebar-button">
        Nouvelle Page
      </button>
      <ul className="page-list">
        <SortableContext items={pages.map(page => page.id)} strategy={verticalListSortingStrategy}>
          {pages.map((page) => (
            <SortableItem
              key={page.id}
              id={page.id}
              page={page}
              isActive={page.id === currentPageId}
              onSelectPage={() => handleSelectPage(page)}
              onDeletePage={onDeletePage}
            />
          ))}
        </SortableContext>
      </ul>
    </div>
  );
};

export default Sidebar;