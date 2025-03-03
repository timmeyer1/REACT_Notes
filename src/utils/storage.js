// src/utils/storage.js
export const loadPages = () => {
    const savedPages = localStorage.getItem('pages');
    return savedPages ? JSON.parse(savedPages) : null;
  };
  
  export const savePages = (pages) => {
    localStorage.setItem('pages', JSON.stringify(pages));
  };