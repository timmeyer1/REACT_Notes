// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import { loadPages, savePages } from './utils/storage';
import { generateSlug } from './utils/url';

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
    const maxId = Math.max(...pages.map(page => page.id), 0);
    return maxId + 1;
  });
  const navigate = useNavigate();
  const { pageSlug } = useParams();

  const pageId = pageSlug ? parseInt(pageSlug.split('_').pop(), 10) : null;

  useEffect(() => {
    savePages(pages);
  }, [pages]);

  useEffect(() => {
    if (!pageSlug && pages.length > 0) {
      navigate(`/${generateSlug(pages[0].title)}_${pages[0].id}`);
    }
  }, [pageSlug, pages, navigate]);

  const handleAddPage = () => {
    const newPage = { id: nextId, title: 'Nouvelle Page', content: '' };
    setPages([...pages, newPage]);
    setNextId(nextId + 1);
    navigate(`/${generateSlug(newPage.title)}_${newPage.id}`);
  };

  const handleDeletePage = (id) => {
    const updatedPages = pages.filter((page) => page.id !== id);
    setPages(updatedPages);
    
    if (pageId === id) {
      navigate(`/${generateSlug(updatedPages[0]?.title)}_${updatedPages[0]?.id}`);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = pages.findIndex((page) => page.id === active.id);
      const newIndex = pages.findIndex((page) => page.id === over.id);
      const reorderedPages = arrayMove(pages, oldIndex, newIndex);
      setPages(reorderedPages);
    }
  };

  const handleUpdatePage = (id, updates) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === id ? { ...page, ...updates } : page
      )
    );
  };

  const handleTitleChange = (pageId, newTitle) => {
    handleUpdatePage(pageId, { title: newTitle });
    navigate(`/${generateSlug(newTitle)}_${pageId}`);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gray-100">
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
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg font-medium">
            Sélectionnez une page
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default AppWrapper;