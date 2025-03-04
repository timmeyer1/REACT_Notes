// src/components/Sidebar/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { generateSlug } from '../../utils/url';

const Sidebar = ({ pages, currentPageId, onAddPage, onDeletePage }) => {
  const navigate = useNavigate();

  const handleSelectPage = (page) => {
    navigate(`/${generateSlug(page.title)}_${page.id}`);
  };

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={onAddPage} 
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-200"
        >
          Nouvelle Page
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto">
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