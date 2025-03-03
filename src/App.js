// src/App.js
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import { loadPages, savePages } from './utils/storage';
import './App.css';

const App = () => {
  // Charger les pages depuis le localStorage au démarrage
  const [pages, setPages] = useState(loadPages() || [{ id: 1, title: '', content: '' }]);
  const [selectedPage, setSelectedPage] = useState(pages[0].id);

  // Sauvegarder les pages dans le localStorage à chaque changement
  useEffect(() => {
    savePages(pages);
  }, [pages]);

  // Ajouter une nouvelle page
  const handleAddPage = () => {
    const newPage = { id: pages.length + 1, title: '', content: '' };
    setPages([...pages, newPage]);
    setSelectedPage(newPage.id);
  };

  // Sélectionner une page
  const handleSelectPage = (id) => {
    setSelectedPage(id);
  };

  // Mettre à jour une page
  const handleUpdatePage = (id, updates) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === id ? { ...page, ...updates } : page
      )
    );
  };

  return (
    <div className="app">
      <Sidebar
        pages={pages}
        selectedPage={selectedPage}
        onAddPage={handleAddPage}
        onSelectPage={handleSelectPage}
      />
      <Editor
        selectedPage={selectedPage}
        pages={pages}
        onUpdatePage={handleUpdatePage}
      />
    </div>
  );
};

export default App;