// src/components/Sidebar/Sidebar.js
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ pages, selectedPage, onAddPage, onSelectPage }) => {
  return (
    <div className="sidebar">
      <button onClick={onAddPage} className="sidebar-button">
        Nouvelle Page
      </button>
      <ul>
        {pages.map((page) => (
          <li
            key={page.id}
            onClick={() => onSelectPage(page.id)}
            className={selectedPage === page.id ? 'selected' : ''}
          >
            {page.title || `Page ${page.id}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;