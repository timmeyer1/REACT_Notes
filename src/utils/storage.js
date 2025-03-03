// src/utils/storage.js
const STORAGE_KEY = 'pages';

export const loadPages = () => {
  try {
    const savedPages = localStorage.getItem(STORAGE_KEY);
    return savedPages ? JSON.parse(savedPages) : null;
  } catch (error) {
    console.error('Erreur lors du chargement des pages:', error);
    return null;
  }
};

export const savePages = (pages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des pages:', error);
    return false;
  }
};