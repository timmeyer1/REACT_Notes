// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import { loadPages, savePages } from './utils/storage';
import { generateSlug } from './utils/url';
import './App.css';

const AppWrapper = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/:pageSlug" element={<AppContent />} />
      </Routes>
    </Router>
  );
};

const AppContent = () => {
  const [pages, setPages] = useState(loadPages() || [{ id: 1, title: 'Nouvelle Page', content: '' }]);
  const [nextId, setNextId] = useState(() => {
    // Calculer le prochain ID basé sur le plus grand ID existant
    const maxId = Math.max(...pages.map(page => page.id), 0);
    return maxId + 1;
  });
  const navigate = useNavigate();
  const { pageSlug } = useParams();

  // Extraire l'ID de la page depuis l'URL
  const pageId = pageSlug ? parseInt(pageSlug.split('_').pop(), 10) : null;

  // Sauvegarder les pages dans localStorage quand elles changent
  useEffect(() => {
    savePages(pages);
  }, [pages]);

  // Rediriger vers la première page si aucune page n'est sélectionnée
  useEffect(() => {
    if (!pageSlug && pages.length > 0) {
      navigate(`/${generateSlug(pages[0].title)}_${pages[0].id}`);
    }
  }, [pageSlug, pages, navigate]);

  // Ajouter une nouvelle page
  const handleAddPage = () => {
    const newPage = { id: nextId, title: 'Nouvelle Page', content: '' };
    setPages([...pages, newPage]);
    setNextId(nextId + 1);
    navigate(`/${generateSlug(newPage.title)}_${newPage.id}`);
  };

  // Supprimer une page
  const handleDeletePage = (id) => {
    if (pages.length === 1) {
      alert('Vous ne pouvez pas supprimer la dernière page !');
      return;
    }
    const updatedPages = pages.filter((page) => page.id !== id);
    setPages(updatedPages);
    
    // Si la page supprimée est la page active, rediriger vers la première page
    if (pageId === id) {
      navigate(`/${generateSlug(updatedPages[0]?.title)}_${updatedPages[0]?.id}`);
    }
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

  // Mettre à jour l'URL lorsque le titre change
  const handleTitleChange = (pageId, newTitle) => {
    handleUpdatePage(pageId, { title: newTitle });
    navigate(`/${generateSlug(newTitle)}_${pageId}`);
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
          currentPageId={pageId}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
        />
        {pageId ? (
          <Editor
            pages={pages}
            pageId={pageId}
            onUpdatePage={handleUpdatePage}
            onTitleChange={handleTitleChange}
          />
        ) : (
          <div className="editor-placeholder">Sélectionnez une page</div>
        )}
      </div>
    </DndContext>
  );
};

export default AppWrapper;