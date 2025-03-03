import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import { loadPages, savePages } from './utils/storage';
import './App.css';

const App = () => {
  // Charger les pages depuis le localStorage au démarrage
  const [pages, setPages] = useState(loadPages() || [{ id: 1, title: '', content: '' }]);
  const [selectedPage, setSelectedPage] = useState(pages[0]?.id || 1);
  const [nextId, setNextId] = useState(pages.length + 1); // Compteur pour les IDs

  // Sauvegarder les pages dans le localStorage à chaque changement
  useEffect(() => {
    savePages(pages);
  }, [pages]);

  // Ajouter une nouvelle page
  const handleAddPage = () => {
    const newPage = { id: nextId, title: '', content: '' }; // Utiliser nextId
    setPages([...pages, newPage]);
    setSelectedPage(newPage.id);
    setNextId(nextId + 1); // Incrémenter le compteur
  };

  // Sélectionner une page
  const handleSelectPage = (id) => {
    setSelectedPage(id);
  };

  // Supprimer une page
  const handleDeletePage = (id) => {
    const updatedPages = pages.filter((page) => page.id !== id);
    setPages(updatedPages);
    setSelectedPage(updatedPages[0]?.id || 1); // Sélectionner la première page restante
  };

  // Réorganiser les pages avec le glisser-déposer
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = pages.findIndex((page) => page.id === active.id);
      const newIndex = pages.findIndex((page) => page.id === over.id);
      const reorderedPages = arrayMove(pages, oldIndex, newIndex);
      setPages(reorderedPages);
    }
  };

  // Mettre à jour le contenu ou le titre d'une page
  const handleUpdatePage = (id, updates) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === id ? { ...page, ...updates } : page
      )
    );
  };

  // Configurer les capteurs pour le glisser-déposer
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="app">
        <Sidebar
          pages={pages}
          selectedPage={selectedPage}
          onAddPage={handleAddPage}
          onSelectPage={handleSelectPage}
          onDeletePage={handleDeletePage}
        />
        <Editor
          selectedPage={selectedPage}
          pages={pages}
          onUpdatePage={handleUpdatePage}
        />
      </div>
    </DndContext>
  );
};

export default App;